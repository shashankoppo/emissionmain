import { Router } from 'express';
import prisma from '../lib/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { initTransporter } from '../services/email.js';

const router = Router();

// Helper to get the correct model name
const getMailModel = () => (prisma as any).appEmail || (prisma as any).emailTemplate || (prisma as any).mailTemplate;

// GET all mail templates
router.get('/', authMiddleware, async (req, res) => {
    try {
        const model = getMailModel();
        if (!model) return res.status(503).json({ error: 'Email model not ready.' });
        const templates = await model.findMany({ orderBy: { createdAt: 'asc' } });
        res.json(templates);
    } catch (error) {
        console.error('Failed to fetch:', error);
        res.status(500).json({ error: 'Failed' });
    }
});

// GET SMTP Settings
router.get('/smtp', authMiddleware, async (req, res) => {
    try {
        const settings = await prisma.setting.findMany({
            where: { key: { in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'] } }
        });
        const config = settings.reduce((acc: any, curr) => { acc[curr.key] = curr.value; return acc; }, {});
        res.json({
            smtp_host: config.smtp_host || '',
            smtp_port: config.smtp_port || '587',
            smtp_user: config.smtp_user || '',
            smtp_pass: config.smtp_pass || '',
            smtp_from: config.smtp_from || ''
        });
    } catch { res.status(500).json({ error: 'Failed' }); }
});

// POST Update SMTP Settings
router.post('/smtp', authMiddleware, async (req, res) => {
    try {
        const { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from } = req.body;
        const keys = { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from };

        console.log('Admin updating SMTP Settings...');

        for (const [key, value] of Object.entries(keys)) {
            await prisma.setting.upsert({
                where: { key },
                update: { value: String(value || '') },
                create: { key, value: String(value || '') }
            });
        }

        // Re-init transporter (now has timeout safety)
        await initTransporter();

        res.json({ success: true, message: 'SMTP settings updated successfully.' });
    } catch (error: any) {
        console.error('Failed to update SMTP settings:', error);
        res.status(500).json({ error: 'Failed to update SMTP settings', details: error.message });
    }
});

// POST Seed
router.post('/seed', authMiddleware, async (req, res) => {
    try {
        const model = getMailModel();
        if (!model) return res.status(503).json({ error: 'Email model not ready.' });
        const templates = [
            {
                type: 'order_success',
                subject: 'Your Emission Order is Confirmed! 🎉',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Thank you, {{customerName}}! 🎉</h1><p style="color:#555">Your order has been confirmed and is being processed.</p><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Order ID:</strong> {{orderId}}</p><p style="margin:8px 0 0"><strong>Amount:</strong> ₹{{amount}}</p></div><p style="color:#555">We will notify you once your order ships. Thank you for choosing <strong>Emission</strong>.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'order_rejected',
                subject: 'Order Update from Emission',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Order Update</h1><p style="color:#555">Dear {{customerName}}, we regret to inform you that your order <strong>#{{orderId}}</strong> has been cancelled or rejected.</p><p style="color:#555">If you believe this is an error, please contact our support team at care@emissionfit.com.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'welcome_email',
                subject: 'Welcome to Emission — Your Account is Ready!',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Welcome, {{customerName}}! 👋</h1><p style="color:#555">Your account has been created on <strong>Emission</strong>, the leading OEM manufacturer of sportswear and medical wear from Jabalpur, India.</p><p style="color:#555">You can now browse and order our products, track your shipments, and manage your account easily.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'new_enquiry_admin',
                subject: 'New Enquiry Received — Emission Admin',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:20px">New Enquiry Received</h1><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Name:</strong> {{name}}</p><p style="margin:8px 0 0"><strong>Email:</strong> {{email}}</p><p style="margin:8px 0 0"><strong>Message:</strong> {{message}}</p></div><p style="color:#999;font-size:12px">Emission Admin Panel — ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'payment_success',
                subject: 'Payment Received — Emission',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Payment Received! ✅</h1><p style="color:#555">We have successfully received your payment.</p><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Order ID:</strong> #{{orderId}}</p><p style="margin:8px 0 0"><strong>Amount Paid:</strong> ₹{{amount}}</p></div><p style="color:#555">Your order is now being processed. Thank you for shopping with <strong>Emission</strong>.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            }
        ];
        for (const t of templates) {
            await model.upsert({ where: { type: t.type }, update: { subject: t.subject, body: t.body, active: true }, create: { type: t.type, subject: t.subject, body: t.body, active: true } });
        }
        res.json({ success: true, message: 'Default templates seeded successfully!' });
    } catch (error) { res.status(500).json({ error: 'Failed to seed templates.' }); }
});

// POST Test SMTP Connection
router.post('/test-smtp', authMiddleware, async (req, res) => {
    try {
        const success = await initTransporter();
        if (success) {
            res.json({ success: true, message: 'SMTP connection verified successfully!' });
        } else {
            res.status(500).json({ error: 'SMTP connection failed. Check your credentials and server firewall.' });
        }
    } catch (error: any) {
        res.status(500).json({ error: 'SMTP Test Exception', details: error.message });
    }
});

// CRUD routes
router.post('/', authMiddleware, async (req, res) => {
    try {
        const model = getMailModel();
        if (!model) return res.status(503).json({ error: 'Not ready' });
        const template = await model.create({ data: req.body });
        res.json(template);
    } catch { res.status(500).json({ error: 'Failed' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const model = getMailModel();
        if (!model) return res.status(503).json({ error: 'Not ready' });
        const template = await model.update({ where: { id: req.params.id }, data: req.body });
        res.json(template);
    } catch { res.status(500).json({ error: 'Failed' }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const model = getMailModel();
        if (!model) return res.status(503).json({ error: 'Not ready' });
        await model.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Failed' }); }
});

export default router;
