import prisma from '../lib/db.js';
import { initTransporter } from './email.js';

export const runStartupTasks = async () => {
    console.log('--- 🚀 STARTING BACKEND INITIALIZATION ---');

    const availableModels = Object.keys(prisma).filter(k => !k.startsWith('_'));
    console.log('Detected Prisma Models:', availableModels);

    try {
        // 1. Force fix SMTP defaults if they are missing or using placeholders
        // Using Hostinger settings as per project requirements
        if (prisma.setting) {
            const defaults = [
                { key: 'smtp_host', value: 'smtp.hostinger.com' },
                { key: 'smtp_port', value: '465' },
                { key: 'smtp_user', value: 'care@emissionfit.com' },
                { key: 'smtp_pass', value: 'Mohit@121212' },
                { key: 'smtp_from', value: 'care@emissionfit.com' }
            ];

            for (const d of defaults) {
                const existing = await prisma.setting.findUnique({ where: { key: d.key } });
                // We overwrite if it's completely missing or just an empty string
                if (!existing || !existing.value || existing.value.trim() === '') {
                    await prisma.setting.upsert({
                        where: { key: d.key },
                        update: { value: d.value },
                        create: { key: d.key, value: d.value }
                    });
                    console.log(`✅ Set SMTP default: ${d.key} = ${d.key.includes('pass') ? '***' : d.value}`);
                }
            }
        }

        // 2. Auto-Seed Email Templates with HEAVY validation
        // This fixes the issue where templates exist but have no HTML body
        const defaultTemplates = [
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

        const templateModel = (prisma as any).appEmail || (prisma as any).emailTemplate || (prisma as any).mailTemplate;

        if (templateModel) {
            for (const t of defaultTemplates) {
                const existing = await templateModel.findUnique({ where: { type: t.type } });

                // CRITICAL FIX: If template body is empty or too short, force update it
                if (!existing || !existing.body || existing.body.length < 50) {
                    await templateModel.upsert({
                        where: { type: t.type },
                        update: { subject: t.subject, body: t.body, active: true },
                        create: { type: t.type, subject: t.subject, body: t.body, active: true }
                    });
                    console.log(`✅ Seeded/Fixed template: ${t.type}`);
                }
            }
        }

        // 3. Initialize Transporter
        await initTransporter();

    } catch (error) {
        console.error('❌ CRITICAL: Startup tasks failed:', error);
    }

    console.log('--- ✅ BACKEND INITIALIZATION COMPLETED ---');
};
