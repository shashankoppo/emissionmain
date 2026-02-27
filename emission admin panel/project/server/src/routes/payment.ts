import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../lib/db.js';

const router = Router();

// Helper to get Razorpay instance with dynamic keys
async function getRazorpayInstance() {
    // First try env variables
    let key_id = process.env.RAZORPAY_KEY_ID;
    let key_secret = process.env.RAZORPAY_KEY_SECRET;

    console.log('--- RAZORPAY INIT ATTEMPT ---');
    console.log('Current Time:', new Date().toISOString());
    console.log('Env Key ID:', key_id ? 'EXISTS' : 'MISSING');

    // If not in env, try database settings
    if (!key_id || !key_secret) {
        console.log('Fetching Razorpay keys from database...');
        try {
            const settings = await prisma.setting.findMany({
                where: {
                    key: { in: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'] }
                }
            });

            const settingsMap = settings.reduce((acc: any, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {});

            key_id = key_id || settingsMap['RAZORPAY_KEY_ID'];
            key_secret = key_secret || settingsMap['RAZORPAY_KEY_SECRET'];

            console.log('Database Key ID:', key_id ? 'FOUND' : 'NOT FOUND');
            console.log('Database Secret:', key_secret ? 'FOUND (Length: ' + key_secret.length + ')' : 'NOT FOUND');
        } catch (dbError) {
            console.error('Database fetch failed during Razorpay init:', dbError);
        }
    }

    if (!key_id || !key_secret) {
        console.error('CRITICAL: Razorpay keys missing in both Env and DB');
        return null;
    }

    try {
        const instance = new Razorpay({
            key_id,
            key_secret,
        });
        console.log('Razorpay instance created successfully');
        return instance;
    } catch (initError) {
        console.error('Razorpay SDK failed to initialize with provided keys:', initError);
        return null;
    }
}

// Check Razorpay Configuration Status
router.get('/status', async (req, res) => {
    try {
        const rzp = await getRazorpayInstance();
        const settings = await prisma.setting.findMany({
            where: { key: { in: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'] } }
        });

        const rzpKey = settings.find(s => s.key === 'RAZORPAY_KEY_ID');
        const rzpSecret = settings.find(s => s.key === 'RAZORPAY_KEY_SECRET');

        const mask = (str: string | undefined) => {
            if (!str || str.length < 8) return 'MISSING/TOO_SHORT';
            return `${str.substring(0, 8)}...${str.substring(str.length - 4)}`;
        };

        res.json({
            configured: !!rzp,
            database_settings: {
                total_settings: settings.length,
                RAZORPAY_KEY_ID: mask(rzpKey?.value),
                RAZORPAY_KEY_SECRET: mask(rzpSecret?.value),
                all_keys_found: settings.map(s => s.key)
            },
            environment_variables: {
                RAZORPAY_KEY_ID_EXISTS: !!process.env.RAZORPAY_KEY_ID,
                RAZORPAY_KEY_SECRET_EXISTS: !!process.env.RAZORPAY_KEY_SECRET
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check status' });
    }
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
    try {
        const razorpay = await getRazorpayInstance();
        if (!razorpay) {
            return res.status(500).json({
                error: 'Razorpay not configured. Please add keys in Settings.'
            });
        }

        const { amount, currency = 'INR', receipt } = req.body;
        // ... rest of the logic

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order,
        });
    } catch (error: any) {
        console.error('Razorpay order creation failed:', error);
        res.status(500).json({
            error: 'Failed to create order',
            details: error.message
        });
    }
});

// Verify payment signature
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails,
            customerId,
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        // Verify signature
        let key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            const setting = await prisma.setting.findUnique({ where: { key: 'RAZORPAY_KEY_SECRET' } });
            key_secret = setting?.value;
        }

        if (!key_secret) {
            return res.status(500).json({ error: 'Razorpay secret not configured' });
        }

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', key_secret)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payment signature'
            });
        }

        // Payment verified - Save order to database
        const order = await prisma.order.create({
            data: {
                customerId: customerId || null,
                customerName: orderDetails.customerName || 'Guest',
                customerEmail: orderDetails.customerEmail || '',
                totalAmount: parseFloat(orderDetails.totalAmount) || 0,
                status: 'paid',
                paymentId: razorpay_payment_id,
                shippingAddress: orderDetails.shippingAddress || '',
                items: JSON.stringify(orderDetails.items || []),
            },
        });

        res.json({
            success: true,
            message: 'Payment verified successfully',
            order
        });
    } catch (error: any) {
        console.error('Payment verification failed:', error);
        res.status(500).json({
            error: 'Payment verification failed',
            details: error.message
        });
    }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
    try {
        const razorpay = await getRazorpayInstance();
        if (!razorpay) {
            return res.status(500).json({ error: 'Razorpay not configured' });
        }

        const { paymentId } = req.params;
        const payment = await razorpay.payments.fetch(paymentId);
        // ...

        res.json({
            success: true,
            payment,
        });
    } catch (error: any) {
        console.error('Failed to fetch payment:', error);
        res.status(500).json({
            error: 'Failed to fetch payment details',
            details: error.message
        });
    }
});

// Refund payment (admin only - add authMiddleware)
router.post('/refund', async (req, res) => {
    try {
        const razorpay = await getRazorpayInstance();
        if (!razorpay) {
            return res.status(500).json({ error: 'Razorpay not configured' });
        }

        const { paymentId, amount } = req.body;
        // ...

        if (!paymentId) {
            return res.status(400).json({ error: 'Payment ID required' });
        }

        const refund = await razorpay.payments.refund(paymentId, {
            amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
        });

        // Update order status
        await prisma.order.updateMany({
            where: { paymentId },
            data: { status: 'refunded' },
        });

        res.json({
            success: true,
            refund,
        });
    } catch (error: any) {
        console.error('Refund failed:', error);
        res.status(500).json({
            error: 'Refund failed',
            details: error.message
        });
    }
});

export default router;
