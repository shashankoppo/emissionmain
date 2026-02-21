import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active banners (public)
router.get('/', async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

// Admin: Get all banners (protected)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

// Admin: Create banner (protected)
router.post('/', authMiddleware, async (req, res) => {
    const { title, subtitle, imageUrl, link, active, order } = req.body;
    try {
        const banner = await prisma.banner.create({
            data: {
                title,
                subtitle,
                imageUrl,
                link,
                active: active !== undefined ? active : true,
                order: parseInt(order as any) || 0
            }
        });
        res.json(banner);
    } catch (error) {
        console.error('Banner creation error:', error);
        res.status(500).json({ error: 'Failed to create banner' });
    }
});

// Admin: Update banner (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, imageUrl, link, active, order } = req.body;
    try {
        const banner = await prisma.banner.update({
            where: { id },
            data: {
                title,
                subtitle,
                imageUrl,
                link,
                active: active !== undefined ? active : true,
                order: parseInt(order as any) || 0
            }
        });
        res.json(banner);
    } catch (error) {
        console.error('Banner update error:', error);
        res.status(500).json({ error: 'Failed to update banner' });
    }
});

// Admin: Delete banner (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.banner.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete banner' });
    }
});

export default router;
