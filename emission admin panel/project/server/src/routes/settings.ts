import { Router } from 'express';
import prisma from '../lib/db.js';
import { authMiddleware } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, '../../debug_settings.log');

const router = Router();

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
        const keyId = setting?.value || process.env.RAZORPAY_KEY_ID || '';
        res.json({ RAZORPAY_KEY_ID: keyId });
    } catch (error) {
        res.json({ RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '' });
    }
});

// Update settings (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const settings = req.body;
        const logMsg = `[${new Date().toISOString()}] Payload: ${JSON.stringify(settings)}\n`;
        fs.appendFileSync(logFile, logMsg);

        const entries = Object.entries(settings);
        for (const [key, value] of entries) {
            await prisma.setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
        }

        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        const errMsg = `[${new Date().toISOString()}] ERROR: ${error instanceof Error ? error.message : String(error)}\n`;
        fs.appendFileSync(logFile, errMsg);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
