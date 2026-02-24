import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import enquiryRoutes from './routes/enquiries.js';
import orderRoutes from './routes/orders.js';
import uploadRoutes from './routes/upload.js';
import paymentRoutes from './routes/payment.js';
import settingsRoutes from './routes/settings.js';
import courierRoutes from './routes/couriers.js';
import bannerRoutes from './routes/banners.js';
import collectionRoutes from './routes/collections.js';
import invoiceRoutes from './routes/invoices.js';
import couponRoutes from './routes/coupons.js';
import customerRoutes from './routes/customers.js';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Trust proxy for Cloudflare/Nginx
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/customers', customerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Emission Admin API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
