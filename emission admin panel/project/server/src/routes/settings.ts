import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get all settings (protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const settings = await prisma.setting.findMany();
        const settingsMap = settings.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(settingsMap);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Get public settings (for frontend Key ID)
router.get('/public', async (req, res) => {
    try {
        const setting = await prisma.setting.findUnique({
            where: { key: 'RAZORPAY_KEY_ID' }
        });
        res.json({ RAZORPAY_KEY_ID: setting?.value || process.env.RAZORPAY_KEY_ID || '' });
    } catch (error) {
        res.json({ RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '' });
    }
});

// Update settings (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const settings = req.body; // Expecting { key: value, ... }

        const updates = Object.entries(settings).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
        });

        await Promise.all(updates);
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Failed to update settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
