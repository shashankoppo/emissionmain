import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrders() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        console.log('--- RECENT ORDERS ---');
        orders.forEach(order => {
            console.log(`Order ID: ${order.id}`);
            console.log(`Customer: ${order.customerName}`);
            console.log(`Items: ${order.items}`);
            console.log('---------------------');
        });
    } catch (error) {
        console.error('Error checking orders:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkOrders();
