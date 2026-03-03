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
            { type: 'order_success', subject: 'Your Order is Confirmed!', body: '...' },
            { type: 'order_rejected', subject: 'Order Update', body: '...' },
            { type: 'welcome_email', subject: 'Welcome!', body: '...' },
            { type: 'new_enquiry_admin', subject: 'New Enquiry', body: '...' },
            { type: 'payment_success', subject: 'Payment Received!', body: '...' }
        ];
        for (const t of templates) {
            await model.upsert({ where: { type: t.type }, update: { subject: t.subject, body: t.body }, create: { type: t.type, subject: t.subject, body: t.body } });
        }
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Failed' }); }
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
