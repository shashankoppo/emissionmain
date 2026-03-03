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
                console.log(`Migrated ${oldKey} to ${newKey}`);
            }
        }
        // 2. Auto-Seed/Fix Mail Templates (always ensure correct content)
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
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:20px">New Enquiry Received</h1><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Name:</strong> {{name}}</p><p style="margin:8px 0 0"><strong>Email:</strong> {{email}}</p><p style="margin:8px 0 0"><strong>Message:</strong> {{message}}</p></div><p style="color:#999;font-size:12px">Emission Admin Panel — ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'payment_success',
                subject: 'Payment Received — Emission',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Payment Received! ✅</h1><p style="color:#555">We have successfully received your payment.</p><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Order ID:</strong> #{{orderId}}</p><p style="margin:8px 0 0"><strong>Amount Paid:</strong> ₹{{amount}}</p></div><p style="color:#555">Your order is now being processed. Thank you for shopping with <strong>Emission</strong>.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            }
        ];
        for (const t of defaultTemplates) {
            await prisma.mailTemplate.upsert({
                where: { type: t.type },
                update: { subject: t.subject, body: t.body, active: true },
                create: { type: t.type, subject: t.subject, body: t.body, active: true }
            });
        }
        console.log('✅ Mail templates seeded/updated.');
        // 3. Seed default site settings
        const defaultSettings = [
            { key: 'SITE_TITLE', value: 'Emission - Premium Sportswear & Medical Wear' },
            { key: 'SITE_DESCRIPTION', value: 'Premium OEM manufacturer of sportswear and medical wear engineered with precision. Born in Jabalpur, India.' },
        ];
        for (const s of defaultSettings) {
            await prisma.setting.upsert({
                where: { key: s.key },
                update: {},
                create: { key: s.key, value: s.value },
            });
        }
        console.log('✅ Site settings seeded.');
        // 4. Initialize Email Transporter
        await initTransporter();
    }
    catch (error) {
        console.error('CRITICAL: Startup tasks failed:', error);
    }
    console.log('--- STARTUP TASKS COMPLETED ---');
};
