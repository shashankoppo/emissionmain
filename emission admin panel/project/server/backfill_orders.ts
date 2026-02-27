/**
 * Backfill script: updates all existing orders to include product name, size, color
 * in the items JSON field, by looking up each productId in the Product table.
 *
 * Run once: npx tsx backfill_orders.ts
 */
import prisma from './src/lib/db.js';

async function backfill() {
    console.log('Starting order items backfill...');
    const orders = await (prisma.order as any).findMany();
    let updated = 0;

    for (const order of orders) {
        try {
            let items: any[];
            try {
                items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            } catch {
                console.warn(`Skipping order ${order.id} — could not parse items`);
                continue;
            }

            // Check if any item is missing a name
            const needsUpdate = items.some((it: any) => !it.name && it.productId);
            if (!needsUpdate) continue;

            const enrichedItems = await Promise.all(items.map(async (item: any) => {
                if (item.name || !item.productId) return item;

                try {
                    const product = await (prisma.product as any).findUnique({
                        where: { id: item.productId },
                        select: { name: true, retailPrice: true, price: true }
                    });
                    if (product) {
                        return {
                            ...item,
                            name: product.name,
                            price: item.price || Number(product.retailPrice || product.price) || 0,
                        };
                    }
                } catch { }
                return item;
            }));

            await (prisma.order as any).update({
                where: { id: order.id },
                data: { items: JSON.stringify(enrichedItems) }
            });
            updated++;
            console.log(`Updated order ${order.id}`);
        } catch (err) {
            console.error(`Error on order ${order.id}:`, err);
        }
    }

    console.log(`Done. Updated ${updated} / ${orders.length} orders.`);
    await prisma.$disconnect();
}

backfill();
