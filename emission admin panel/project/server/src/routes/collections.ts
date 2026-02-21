import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active collections (public)
router.get('/', async (req, res) => {
    try {
        const collections = await prisma.featuredCollection.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        });
        res.json(collections);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
});

// Admin: Get all collections (protected)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const collections = await prisma.featuredCollection.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(collections);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
});

// Admin: Create collection (protected)
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, imageUrl, link, active, order } = req.body;
    try {
        const collection = await prisma.featuredCollection.create({
            data: {
                title,
                description,
                imageUrl,
                link,
                active: active !== undefined ? active : true,
                order: parseInt(order as any) || 0
            }
        });
        res.json(collection);
    } catch (error) {
        console.error('Collection creation error:', error);
        res.status(500).json({ error: 'Failed to create collection' });
    }
});

// Admin: Update collection (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl, link, active, order } = req.body;
    try {
        const collection = await prisma.featuredCollection.update({
            where: { id },
            data: {
                title,
                description,
                imageUrl,
                link,
                active: active !== undefined ? active : true,
                order: parseInt(order as any) || 0
            }
        });
        res.json(collection);
    } catch (error) {
        console.error('Collection update error:', error);
        res.status(500).json({ error: 'Failed to update collection' });
    }
});

// Admin: Delete collection (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.featuredCollection.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete collection' });
    }
});

export default router;
