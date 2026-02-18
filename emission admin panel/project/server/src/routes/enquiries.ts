import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// Create enquiry (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, enquiryType, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        company: company || '',
        enquiryType: enquiryType || 'General',
        message
      }
    });

    res.status(201).json(enquiry);
  } catch (error: any) {
    console.error('Failed to create enquiry:', error);
    res.status(500).json({ error: 'Failed to create enquiry', details: error.message });
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const enquiry = await prisma.enquiry.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

export default router;
