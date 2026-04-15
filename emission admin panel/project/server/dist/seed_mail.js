import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function seed() {
    console.log('--- SEEDING MAIL TEMPLATES ---');
    // Fallback logic for model name to handle different Prisma generations
    const AppEmailModel = prisma.appEmail || prisma.emailTemplate || prisma.mailTemplate;
    if (!AppEmailModel) {
        console.error('❌ CRITICAL ERROR: Could not find AppEmail, EmailTemplate, or MailTemplate model in Prisma client.');
        console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
        process.exit(1);
    }
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
    for (const t of defaultTemplates) {
        const result = await AppEmailModel.upsert({
            where: { type: t.type },
            update: {
                subject: t.subject,
                body: t.body,
                active: true,
            },
            create: {
                type: t.type,
                subject: t.subject,
                body: t.body,
                active: true,
            }
        });
        console.log(`✅ Seeded template: ${result.type}`);
    }
    // Also seed default SMTP settings if they are missing
    console.log('\n--- CHECKING SMTP SETTINGS ---');
    const smtpDefaults = [
        { key: 'smtp_host', value: 'smtp.hostinger.com' },
        { key: 'smtp_port', value: '465' },
        { key: 'smtp_user', value: 'care@emissionfit.com' },
        { key: 'smtp_pass', value: 'Mohit@121212' },
        { key: 'smtp_from', value: 'care@emissionfit.com' }
    ];
    for (const d of smtpDefaults) {
        const existing = await prisma.setting.findUnique({ where: { key: d.key } });
        if (!existing || !existing.value) {
            await prisma.setting.upsert({
                where: { key: d.key },
                update: { value: d.value },
                create: { key: d.key, value: d.value }
            });
            console.log(`- Set default ${d.key}`);
        }
        else {
            console.log(`- ${d.key} already exists`);
        }
    }
    console.log('\n✨ DONE: All templates and settings seeded.');
    process.exit(0);
}
seed().catch(err => {
    console.error('❌ SEEDING FAILED:', err);
    process.exit(1);
});
