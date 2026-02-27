import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'emission_admin_secret_key_change_in_production';

// Auth middleware for customers
const customerAuth = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.customerId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Register a new customer
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }
        const existing = await prisma.customer.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'An account with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await prisma.customer.create({
            data: { name, email, password: hashedPassword, phone },
        });
        const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
    } catch (error) {
        console.error('Customer register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login an existing customer
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const customer = await prisma.customer.findUnique({ where: { email } });
        if (!customer) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isValid = await bcrypt.compare(password, customer.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: customer.id, email: customer.email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
    } catch (error) {
        console.error('Customer login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get customer profile with orders
router.get('/orders', customerAuth, async (req: any, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { customerId: req.customerId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ orders });
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

export default router;
