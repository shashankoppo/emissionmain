import { Router } from 'express';
import prisma from '../lib/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { initTransporter } from '../services/email.js';

const router = Router();
const getMailModel = () => (prisma).appEmail || (prisma).emailTemplate || (prisma).mailTemplate;

router.get('/', authMiddleware, async (req, res) => {
    try {
        const model = getMailModel();
        if (!model) return res.status(503).json({ error: 'Email model not ready.' });
        const templates = await model.findMany({ orderBy: { createdAt: 'asc' } });
        res.json(templates);
    } catch { res.status(500).json({ error: 'Failed to fetch templates' }); }
});

router.get('/smtp', authMiddleware, async (req, res) => {
    try {
        const settings = await prisma.setting.findMany({ where: { key: { in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'] } } });
        const config = settings.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
        res.json({ smtp_host: config.smtp_host || '', smtp_port: config.smtp_port || '587', smtp_user: config.smtp_user || '', smtp_pass: config.smtp_pass || '', smtp_from: config.smtp_from || '' });
    } catch { res.status(500).json({ error: 'Failed to fetch SMTP settings' }); }
});

router.post('/smtp', authMiddleware, async (req, res) => {
    try {
        const { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from } = req.body;
        const keys = { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from };

        console.log('Updating SMTP Settings:', { host: smtp_host, user: smtp_user, from: smtp_from });

        for (const [key, value] of Object.entries(keys)) {
            await prisma.setting.upsert({
                where: { key },
                update: { value: String(value || '') },
                create: { key, value: String(value || '') }
            });
        }

        // initTransporter will now handle timeouts internally
        await initTransporter();

        res.json({ success: true, message: 'SMTP settings updated successfully.' });
    } catch (error) {
        console.error('Failed to update SMTP settings:', error);
        res.status(500).json({ error: 'Failed to update SMTP settings', details: error.message });
    }
});

router.post('/seed', authMiddleware, async (req, res) => {
    try {
        const model = getMailModel();
        if (!model) return res.status(503).json({ error: 'Email model not ready.' });
        const templates = [{ type: 'order_success', subject: 'Your Order is Confirmed!', body: '...' }, { type: 'order_rejected', subject: 'Order Update', body: '...' }, { type: 'welcome_email', subject: 'Welcome!', body: '...' }, { type: 'new_enquiry_admin', subject: 'New Enquiry', body: '...' }, { type: 'payment_success', subject: 'Payment Received!', body: '...' }];
        for (const t of templates) { await model.upsert({ where: { type: t.type }, update: { subject: t.subject, body: t.body }, create: { type: t.type, subject: t.subject, body: t.body } }); }
        res.json({ success: true });
    } catch { res.status(500).json({ error: 'Failed' }); }
});

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
