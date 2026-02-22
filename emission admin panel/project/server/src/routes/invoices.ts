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
    } catch (error) {
        console.error('Failed to fetch invoice template:', error);
        res.status(500).json({ error: 'Failed to fetch invoice template' });
    }
});

// Update invoice template
router.put('/template', authMiddleware, async (req, res) => {
    try {
        const {
            companyName,
            companyAddress,
            companyPhone,
            companyEmail,
            companyLogo,
            gstNumber,
            terms,
            primaryColor,
            accentColor
        } = req.body;

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

        const template = await (prisma as any).invoiceTemplate.upsert({
            where: { id: 'default-template' },
            update: templateData,
            create: {
                id: 'default-template',
                ...templateData
            }
        });

        res.json(template);
    } catch (error) {
        console.error('Failed to update invoice template:', error);
        res.status(500).json({ error: 'Failed to update invoice template', details: error instanceof Error ? error.message : String(error) });
    }
});

export default router;
