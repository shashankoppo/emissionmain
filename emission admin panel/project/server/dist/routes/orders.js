import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import prisma from '../lib/db.js';
import { sendEmail } from '../services/email.js';
const router = Router();
// Helper: enrich parsed items with product name/price from DB
async function enrichItems(rawItems) {
    let items = [];
    try {
        items = typeof rawItems === 'string' ? JSON.parse(rawItems || '[]') : (rawItems || []);
    }
    catch {
        return [];
    }
    return Promise.all(items.map(async (item) => {
        // If name already present, nothing to do
        if (item.name && item.name !== 'Product')
            return item;
        // Look up product by ID
        if (!item.productId)
            return item;
        try {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                select: { name: true, retailPrice: true, price: true }
            });
            if (product) {
                return {
                    ...item,
                    name: product.name,
                    price: item.price || Number(product.retailPrice || product.price) || 0
                };
            }
        }
        catch { }
        return item;
    }));
}
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
        // Enrich each order's items with product names
        const enriched = await Promise.all(orders.map(async (order) => {
            const items = await enrichItems(order.items);
            return { ...order, items: JSON.stringify(items), parsedItems: items };
        }));
        res.json(enriched);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
// Create order
router.post('/', async (req, res) => {
    const { customerName, customerEmail, customerPhone, totalAmount, status, paymentId, shippingAddress, items, source } = req.body;
    try {
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                customerPhone,
                totalAmount,
                status: status || 'pending',
                paymentId,
                shippingAddress,
                items: JSON.stringify(items),
                source: source || 'website'
            }
        });
        // Send order success email silently
        sendEmail(order.customerEmail, 'order_success', {
            customerName: order.customerName,
            orderId: order.id,
            amount: order.totalAmount.toString(),
        });
        res.json(order);
    }
    catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status: req.body.status },
        });
        if (req.body.status === 'rejected' || req.body.status === 'cancelled') {
            sendEmail(order.customerEmail, 'order_rejected', {
                customerName: order.customerName,
                orderId: order.id,
            });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});
export default router;
