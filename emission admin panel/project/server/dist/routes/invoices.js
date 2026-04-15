import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
const prisma = new PrismaClient();
// Get invoice template
router.get('/template', async (req, res) => {
    try {
        let template = await prisma.invoiceTemplate.findFirst({
            where: { id: 'default-template' }
        });
        if (!template) {
            template = await prisma.invoiceTemplate.create({
                data: {
                    id: 'default-template',
                    companyName: 'EMISSION',
                    companyAddress: 'Jabalpur, Madhya Pradesh',
                    companyPhone: '+91 0000000000',
                    companyEmail: 'support@emission.in',
                    terms: 'Thank you for choosing EMISSION. We appreciate your business!',
                    primaryColor: '#1a1a1a',
                    accentColor: '#3b82f6'
                }
            });
        }
        res.json(template);
    }
    catch (error) {
        console.error('Failed to fetch invoice template:', error);
        res.status(500).json({ error: 'Failed to fetch invoice template' });
    }
});
// Update invoice template
router.put('/template', authMiddleware, async (req, res) => {
    try {
        const { companyName, companyAddress, companyPhone, companyEmail, companyLogo, gstNumber, terms, primaryColor, accentColor } = req.body;
        const templateData = {
            companyName: companyName || 'EMISSION',
            companyAddress: companyAddress || '',
            companyPhone: companyPhone || '',
            companyEmail: companyEmail || '',
            companyLogo: companyLogo || null,
            gstNumber: gstNumber || '',
            terms: terms || '',
            primaryColor: primaryColor || '#1a1a1a',
            accentColor: accentColor || '#3b82f6'
        };
        const template = await prisma.invoiceTemplate.upsert({
            where: { id: 'default-template' },
            update: templateData,
            create: {
                id: 'default-template',
                ...templateData
            }
        });
        res.json(template);
    }
    catch (error) {
        console.error('Failed to update invoice template:', error);
        res.status(500).json({ error: 'Failed to update invoice template', details: error instanceof Error ? error.message : String(error) });
    }
});
// Send Manual Invoice Email
router.post('/send/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        const { sendEmail } = await import('../services/email.js');
        const success = await sendEmail(order.customerEmail, 'invoice_manual', {
            customerName: order.customerName,
            orderId: order.invoiceId || order.id.slice(0, 8).toUpperCase(),
            amount: Number(order.totalAmount).toLocaleString(),
        });
        if (success) {
            res.json({ success: true, message: 'Invoice sent successfully' });
        }
        else {
            res.status(500).json({ error: 'Failed to send invoice email' });
        }
    }
    catch (error) {
        console.error('Invoice manual send error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});
export default router;
