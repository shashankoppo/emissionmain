import { Router } from 'express';
import prisma from '../lib/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { initTransporter } from '../services/email.js';

const router = Router();

// =====================================================
// IMPORTANT: Named routes MUST come before /:id routes
// =====================================================

// GET all mail templates
router.get('/', authMiddleware, async (req, res) => {
    try {
        const templates = await prisma.mailTemplate.findMany({
            orderBy: { createdAt: 'asc' }
        });
        res.json(templates);
    } catch (error) {
        console.error('Failed to fetch mail templates:', error);
        res.status(500).json({ error: 'Failed to fetch mail templates' });
    }
});

// GET SMTP Settings — must be before /:id
router.get('/smtp', authMiddleware, async (req, res) => {
    try {
        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from']
                }
            }
        });
        const config = settings.reduce((acc: any, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json({
            smtp_host: config.smtp_host || '',
            smtp_port: config.smtp_port || '587',
            smtp_user: config.smtp_user || '',
            smtp_pass: config.smtp_pass || '',
            smtp_from: config.smtp_from || ''
        });
    } catch (error) {
        console.error('Failed to fetch SMTP settings:', error);
        res.status(500).json({ error: 'Failed to fetch SMTP settings' });
    }
});

// POST Update SMTP Settings — must be before /:id
router.post('/smtp', authMiddleware, async (req, res) => {
    try {
        const { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from } = req.body;
        const keys = { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from };
        for (const [key, value] of Object.entries(keys)) {
            await prisma.setting.upsert({
                where: { key },
                update: { value: value?.toString() || '' },
                create: { key, value: value?.toString() || '' },
            });
        }
        await initTransporter();
        res.json({ success: true, message: 'SMTP settings updated successfully.' });
    } catch (error) {
        console.error('Failed to update SMTP settings:', error);
        res.status(500).json({ error: 'Failed to update SMTP settings' });
    }
});

// POST Seed default templates — must be before /:id
router.post('/seed', authMiddleware, async (req, res) => {
    try {
        const defaultTemplates = [
            {
                type: 'order_success',
                subject: 'Your Emission Order is Confirmed! 🎉',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Thank you, {{customerName}}! 🎉</h1><p style="color:#555">Your order has been confirmed and is being processed.</p><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Order ID:</strong> {{orderId}}</p><p style="margin:8px 0 0"><strong>Amount:</strong> ₹{{amount}}</p></div><p style="color:#555">We will notify you once your order ships. Thank you for choosing <strong>Emission</strong>.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'order_rejected',
                subject: 'Order Update from Emission',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Order Update</h1><p style="color:#555">Dear {{customerName}}, we regret to inform you that your order <strong>#{{orderId}}</strong> has been cancelled or rejected.</p><p style="color:#555">If you believe this is an error, please contact our support team at genesis@emission.in.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'welcome_email',
                subject: 'Welcome to Emission — Your Account is Ready!',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Welcome, {{customerName}}! 👋</h1><p style="color:#555">Your account has been created on <strong>Emission</strong>, the leading OEM manufacturer of sportswear and medical wear from Jabalpur, India.</p><p style="color:#555">You can now browse and order our products, track your shipments, and manage your account easily.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'new_enquiry_admin',
                subject: 'New Enquiry Received — Emission Admin',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:20px">New Enquiry Received</h1><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Name:</strong> {{name}}</p><p style="margin:8px 0 0"><strong>Email:</strong> {{email}}</p><p style="margin:8px 0 0"><strong>Message:</strong> {{message}}</p></div><p style="color:#999;font-size:12px">Emission Admin — ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'payment_success',
                subject: 'Payment Received — Emission',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Payment Received! ✅</h1><p style="color:#555">We have successfully received your payment.</p><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Order ID:</strong> #{{orderId}}</p><p style="margin:8px 0 0"><strong>Amount Paid:</strong> ₹{{amount}}</p></div><p style="color:#555">Your order is now being processed. Thank you for shopping with <strong>Emission</strong>.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            }
        ];

        let seeded = 0;
        for (const t of defaultTemplates) {
            await prisma.mailTemplate.upsert({
                where: { type: t.type },
                update: { subject: t.subject, body: t.body, active: true },
                create: { type: t.type, subject: t.subject, body: t.body, active: true }
            });
            seeded++;
        }
        res.json({ success: true, message: `Seeded/updated ${seeded} templates.` });
    } catch (error: any) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Failed to seed mail templates', details: error.message });
    }
});

// POST Create a new custom mail template
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { type, subject, body, active } = req.body;
        if (!type || !subject || !body) {
            return res.status(400).json({ error: 'type, subject, and body are required.' });
        }
        const template = await prisma.mailTemplate.create({
            data: { type, subject, body, active: active ?? true }
        });
        res.json(template);
    } catch (error: any) {
        console.error('Failed to create mail template:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `A template with type "${req.body.type}" already exists.` });
        }
        res.status(500).json({ error: 'Failed to create mail template' });
    }
});

// PUT Update a mail template — /:id must be AFTER named routes
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, body, active } = req.body;
        const template = await prisma.mailTemplate.update({
            where: { id },
            data: { subject, body, active }
        });
        res.json(template);
    } catch (error) {
        console.error('Failed to update mail template:', error);
        res.status(500).json({ error: 'Failed to update mail template' });
    }
});

// DELETE a mail template
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.mailTemplate.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to delete mail template:', error);
        res.status(500).json({ error: 'Failed to delete mail template' });
    }
});

export default router;

