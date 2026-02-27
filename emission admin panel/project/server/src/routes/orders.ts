import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

import prisma from '../lib/db.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create order
router.post('/', async (req, res) => {
  const { customerName, customerEmail, customerPhone, totalAmount, status, paymentId, shippingAddress, items, source } = req.body;
  try {
    const order = await (prisma as any).order.create({
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
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
