import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get all coupons
router.get('/', authMiddleware, async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
});

// Create coupon
router.post('/', authMiddleware, async (req, res) => {
    const { code, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate, usageLimit, active } = req.body;
    try {
        const coupon = await prisma.coupon.create({
            data: {
                code,
                discountType,
                discountValue,
                minOrderAmount: minOrderAmount || 0,
                maxDiscount,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                usageLimit: usageLimit || 0,
                active: active !== undefined ? active : true
            }
        });
        res.json(coupon);
    } catch (error) {
        console.error('Coupon creation error:', error);
        res.status(500).json({ error: 'Failed to create coupon' });
    }
});

// Validate coupon
router.post('/validate', async (req, res) => {
    const { code, orderAmount } = req.body;
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code }
        });

        if (!coupon) {
            return res.status(404).json({ error: 'Invalid coupon code' });
        }

        if (!coupon.active) {
            return res.status(400).json({ error: 'Coupon is inactive' });
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ error: 'Coupon usage limit reached' });
        }

        if (Number(orderAmount) < Number(coupon.minOrderAmount)) {
            return res.status(400).json({ error: `Minimum order amount of ₹${coupon.minOrderAmount} required` });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (Number(orderAmount) * Number(coupon.discountValue)) / 100;
            if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
                discount = Number(coupon.maxDiscount);
            }
        } else {
            discount = Number(coupon.discountValue);
        }

        res.json({
            valid: true,
            discount,
            couponId: coupon.id,
            code: coupon.code
        });
    } catch (error) {
        res.status(500).json({ error: 'Validation failed' });
    }
});

// Update coupon
router.put('/:id', authMiddleware, async (req, res) => {
    const { code, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate, usageLimit, active } = req.body;
    try {
        const coupon = await prisma.coupon.update({
            where: { id: req.params.id },
            data: {
                code,
                discountType,
                discountValue,
                minOrderAmount,
                maxDiscount,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                usageLimit,
                active
            }
        });
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update coupon' });
    }
});

// Delete coupon
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.coupon.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
});

export default router;
