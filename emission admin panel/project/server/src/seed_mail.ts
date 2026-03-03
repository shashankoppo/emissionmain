import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
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
        }
    ];

    console.log('Seeding templates...');
    for (const t of defaultTemplates) {
        const result = await prisma.mailTemplate.upsert({
            where: { type: t.type },
            update: {},
            create: {
                type: t.type,
                subject: t.subject,
                body: t.body,
                active: true,
            }
        });
        console.log(`- ${result.type}: ${result.id}`);
    }
    console.log('Done.');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
