import { Router } from 'express';
import prisma from '../lib/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { initTransporter } from '../services/email.js';

const router = Router();

// Get all mail templates
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

// Update a mail template
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, body, active } = req.body;

        const template = await prisma.mailTemplate.update({
            where: { id },
            data: {
                subject,
                body,
                active,
            }
        });

        res.json(template);
    } catch (error) {
        console.error('Failed to update mail template:', error);
        res.status(500).json({ error: 'Failed to update mail template' });
    }
});

// Seed default templates if and only if they don't exist
router.post('/seed', authMiddleware, async (req, res) => {
    try {
        const defaultTemplates = [
            {
                type: 'order_success',
                subject: 'Order Confirmation - Emission',
                body: '<h1>Thank you for your order, {{customerName}}!</h1><p>Your order ID is <strong>{{orderId}}</strong> for an amount of ₹{{amount}}.</p><p>We will notify you once it ships.</p>',
            },
            {
                type: 'order_rejected',
                subject: 'Order Update - Emission',
                body: '<h1>Order Cancellation</h1><p>Dear {{customerName}}, your order <strong>{{orderId}}</strong> has been rejected/cancelled.</p><p>If you have any questions, please contact our support.</p>',
            },
            {
                type: 'welcome_email',
                subject: 'Welcome to Emission',
                body: '<h1>Welcome, {{customerName}}!</h1><p>Thank you for joining our community. We are excited to have you with us.</p>',
            },
            {
                type: 'new_enquiry_admin',
                subject: 'New Enquiry Received',
                body: '<h1>New Enquiry</h1><p>You have received a new enquiry from <strong>{{name}}</strong> ({{email}}).</p><p>Message: {{message}}</p>',
            },
            {
                type: 'payment_success',
                subject: 'Payment Successful - Emission',
                body: '<h1>Payment Received!</h1><p>We have successfully received your payment of ₹{{amount}} for order #{{orderId}}.</p><p>We are processing your order now.</p>',
            }
        ];

        let seeded = 0;
        for (const t of defaultTemplates) {
            try {
                await prisma.mailTemplate.upsert({
                    where: { type: t.type },
                    update: {},
                    create: {
                        type: t.type,
                        subject: t.subject,
                        body: t.body,
                        active: true,
                    }
                });
                seeded++;
            } catch (err) {
                console.error(`Failed to seed template ${t.type}:`, err);
            }
        }
        res.json({ success: true, message: `Verified/Seeded ${seeded} templates.` });
    } catch (error: any) {
        console.error('Global seed error:', error);
        res.status(500).json({ error: 'Failed to seed mail templates', details: error.message });
    }
});

// Get SMTP Settings
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
            smtp_port: config.smtp_port || '',
            smtp_user: config.smtp_user || '',
            smtp_pass: config.smtp_pass || '',
            smtp_from: config.smtp_from || ''
        });
    } catch (error) {
        console.error('Failed to fetch SMTP settings:', error);
        res.status(500).json({ error: 'Failed to fetch SMTP settings' });
    }
});

// Update SMTP Settings
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

        // Re-initialize transporter with new settings
        await initTransporter();

        res.json({ success: true, message: 'SMTP settings updated successfully.' });
    } catch (error) {
        console.error('Failed to update SMTP settings:', error);
        res.status(500).json({ error: 'Failed to update SMTP settings' });
    }
});

export default router;
