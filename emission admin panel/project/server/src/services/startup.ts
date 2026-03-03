import prisma from '../lib/db.js';
import { initTransporter } from './email.js';

export const runStartupTasks = async () => {
    console.log('--- STARTING STARTUP TASKS ---');

    try {
        // 1. Migrate SMTP keys (Uppercase -> Lowercase)
        const keysToMigrate = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
        for (const oldKey of keysToMigrate) {
            const setting = await prisma.setting.findUnique({ where: { key: oldKey } });
            if (setting) {
                const newKey = oldKey.toLowerCase();
                await prisma.setting.upsert({
                    where: { key: newKey },
                    update: { value: setting.value },
                    create: { key: newKey, value: setting.value }
                });
                // We keep the old keys for safety but the code uses new ones
                console.log(`Migrated ${oldKey} to ${newKey}`);
            }
        }

        // 2. Auto-Seed Mail Templates if none exist or missing
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

        for (const t of defaultTemplates) {
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
        }
        console.log('Mail templates verified/seeded.');

        // 3. Initialize Email Transporter
        await initTransporter();

    } catch (error) {
        console.error('CRITICAL: Startup tasks failed:', error);
    }

    console.log('--- STARTUP TASKS COMPLETED ---');
};
