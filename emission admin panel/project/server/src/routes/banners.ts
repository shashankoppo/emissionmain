import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all banners
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

// Admin: Get all banners (including inactive)
router.get('/admin', async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

// Create banner
router.post('/', async (req, res) => {
    const { title, subtitle, imageUrl, link, active, order } = req.body;
    try {
        const banner = await prisma.banner.create({
            data: { title, subtitle, imageUrl, link, active, order: parseInt(order) || 0 }
        });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create banner' });
    }
});

// Update banner
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, imageUrl, link, active, order } = req.body;
    try {
        const banner = await prisma.banner.update({
            where: { id },
            data: { title, subtitle, imageUrl, link, active, order: parseInt(order) || 0 }
        });
        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update banner' });
    }
});

// Delete banner
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.banner.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete banner' });
    }
});

export default router;
