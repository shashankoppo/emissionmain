import { Router } from 'express';
import prisma from '../lib/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { initTransporter } from '../services/email.js';

const router = Router();

// GET all mail templates
router.get('/', authMiddleware, async (req, res) => {
    try {
        const model = (prisma).emailTemplate;
        if (!model) return res.status(503).json({ error: 'Email template model not ready.' });
        const templates = await model.findMany({ orderBy: { createdAt: 'asc' } });
        res.json(templates);
    } catch (error) {
        console.error('Failed to fetch mail templates:', error);
        res.status(500).json({ error: 'Failed to fetch mail templates' });
    }
});

// GET SMTP Settings
router.get('/smtp', authMiddleware, async (req, res) => {
    try {
        const settings = await prisma.setting.findMany({
            where: { key: { in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'] } }
        });
        const config = settings.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
        res.json({
            smtp_host: config.smtp_host || '',
            smtp_port: config.smtp_port || '587',
            smtp_user: config.smtp_user || '',
            smtp_pass: config.smtp_pass || '',
            smtp_from: config.smtp_from || ''
        });
    } catch (error) { res.status(500).json({ error: 'Failed to fetch SMTP settings' }); }
});

// POST Update SMTP Settings
router.post('/smtp', authMiddleware, async (req, res) => {
    try {
        const { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from } = req.body;
        const keys = { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from };
        for (const [key, value] of Object.entries(keys)) {
            await prisma.setting.upsert({ where: { key }, update: { value: String(value || '') }, create: { key, value: String(value || '') } });
        }
        await initTransporter();
        res.json({ success: true, message: 'SMTP settings updated successfully.' });
    } catch (error) { res.status(500).json({ error: 'Failed to update SMTP settings' }); }
});

// POST Seed default templates
router.post('/seed', authMiddleware, async (req, res) => {
    try {
        const model = (prisma).emailTemplate;
        if (!model) return res.status(503).json({ error: 'Email template model not ready.' });
        const defaultTemplates = [
            { type: 'order_success', subject: 'Your Emission Order is Confirmed! 🎉', body: '...' },
            { type: 'order_rejected', subject: 'Order Update from Emission', body: '...' },
            { type: 'welcome_email', subject: 'Welcome to Emission — Your Account is Ready!', body: '...' },
            { type: 'new_enquiry_admin', subject: 'New Enquiry Received — Emission Admin', body: '...' },
            { type: 'payment_success', subject: 'Payment Received — Emission', body: '...' }
        ];
        let seeded = 0;
        for (const t of defaultTemplates) {
            await model.upsert({ where: { type: t.type }, update: { subject: t.subject, body: t.body, active: true }, create: { type: t.type, subject: t.subject, body: t.body, active: true } });
            seeded++;
        }
        res.json({ success: true, message: `Seeded ${seeded} templates.` });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Failed to seed mail templates', details: error.message });
    }
});

// POST Create a new custom mail template
router.post('/', authMiddleware, async (req, res) => {
    try {
        const model = (prisma).emailTemplate;
        if (!model) return res.status(503).json({ error: 'Email template model not ready.' });
        const { type, subject, body, active } = req.body;
        const template = await model.create({ data: { type, subject, body, active: active ?? true } });
        res.json(template);
    } catch (error) { res.status(500).json({ error: 'Failed to create mail template' }); }
});

// PUT Update
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const model = (prisma).emailTemplate;
        if (!model) return res.status(503).json({ error: 'Email template model not ready.' });
        const { id } = req.params;
        const { subject, body, active } = req.body;
        const template = await model.update({ where: { id }, data: { subject, body, active } });
        res.json(template);
    } catch (error) { res.status(500).json({ error: 'Failed to update' }); }
});

// DELETE
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const model = (prisma).emailTemplate;
        if (!model) return res.status(503).json({ error: 'Email template model not ready.' });
        const { id } = req.params;
        await model.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Failed to delete' }); }
});

export default router;
