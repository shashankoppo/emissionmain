import prisma from './src/lib/db.js';

async function main() {
    const count = await (prisma.order as any).count();
    console.log('TOTAL ORDERS:', count);

    const orders = await (prisma.order as any).findMany({ take: 3, orderBy: { createdAt: 'desc' } });
    for (const o of orders) {
        console.log('\n--- ORDER ---');
        console.log('ID:', o.id);
        console.log('Customer:', o.customerName);
        console.log('Status:', o.status);
        console.log('Items (raw):', o.items ? o.items.slice(0, 200) : 'NULL/EMPTY');
    }

    await prisma.$disconnect();
}

main().catch(console.error);
