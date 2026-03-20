import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

import prisma from '../lib/db.js';
import { sendEmail } from '../services/email.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.enquiry.count()
    ]);

    res.json({
      data: enquiries,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
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

    // Send email notification to admin
    const adminSetting = await prisma.setting.findUnique({ where: { key: 'smtp_from' } });
    const adminEmail = adminSetting?.value || 'admin@emission.in';

    sendEmail(adminEmail, 'new_enquiry_admin', {
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      enquiryType: enquiry.enquiryType,
      message: enquiry.message
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
