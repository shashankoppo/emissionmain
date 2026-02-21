import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all couriers
router.get('/', authMiddleware, async (req, res) => {
    try {
        const couriers = await prisma.courier.findMany();
        res.json(couriers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch couriers' });
    }
});

// Create courier
router.post('/', authMiddleware, async (req, res) => {
    const { name, api_key, apiUrl, active } = req.body;
    try {
        const courier = await prisma.courier.create({
            data: { name, api_key, apiUrl, active: active !== undefined ? active : true }
        });
        res.json(courier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create courier' });
    }
});

// Update courier
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, api_key, apiUrl, active } = req.body;
    try {
        const courier = await prisma.courier.update({
            where: { id },
            data: { name, api_key, apiUrl, active: active !== undefined ? active : true }
        });
        res.json(courier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update courier' });
    }
});

// Delete courier
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.courier.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete courier' });
    }
});

export default router;
