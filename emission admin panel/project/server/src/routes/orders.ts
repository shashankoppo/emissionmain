import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

import prisma from '../lib/db.js';
import { sendEmail } from '../services/email.js';

const router = Router();

// Helper: enrich parsed items with product name/price from DB
async function enrichItems(rawItems: string | any[]): Promise<any[]> {
  let items: any[] = [];
  try {
    items = typeof rawItems === 'string' ? JSON.parse(rawItems || '[]') : (rawItems || []);
  } catch { return []; }

  return Promise.all(items.map(async (item: any) => {
    // If name already present, nothing to do
    if (item.name && item.name !== 'Product') return item;
    // Look up product by ID
    if (!item.productId) return item;
    try {
      const product = await (prisma.product as any).findUnique({
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
    } catch { }
    return item;
  }));
}

router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count()
    ]);

    // Enrich each order's items with product names
    const enriched = await Promise.all(orders.map(async (order) => {
      const items = await enrichItems((order as any).items);
      return { ...order, items: JSON.stringify(items), parsedItems: items };
    }));

    res.json({
      data: enriched,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create order
router.post('/', async (req, res) => {
  const { customerId, customerName, customerEmail, customerPhone, totalAmount, status, paymentId, shippingAddress, items, source } = req.body;
  try {
    const order = await (prisma as any).order.create({
      data: {
        customerId: customerId || null,
        customerName,
        customerEmail,
        customerPhone,
        totalAmount: parseFloat(String(totalAmount)) || 0,
        status: status || 'pending',
        paymentId,
        shippingAddress,
        items: JSON.stringify(items),
        source: source || 'website'
      }
    });

    // Reduce stock for each item
    try {
      const parsedItems = Array.isArray(items) ? items : JSON.parse(items || '[]');
      await Promise.all(parsedItems.map(async (item: any) => {
        if (item.productId && item.size) {
          await prisma.productVariant.updateMany({
            where: {
              productId: item.productId,
              size: item.size,
              color: item.color || '',
            },
            data: {
              stock: {
                decrement: parseInt(item.quantity.toString()) || 0
              }
            }
          });
        }
      }));
    } catch (stockErr) {
      console.error('Failed to update stock:', stockErr);
    }

    // Send order success email
    // Use try-catch to prevent email failure from breaking the order response
    try {
      await sendEmail(order.customerEmail, 'order_success', {
        customerName: order.customerName,
        orderId: order.id,
        amount: order.totalAmount.toString(),
      });
    } catch (mailErr) {
      console.error('Background order email failed:', mailErr);
    }

    res.json(order);
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
