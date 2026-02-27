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
import prisma from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Cloudflare/Nginx
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Admin Panel Client
app.use('/admin', express.static(path.join(__dirname, '../../client/dist')));

// SPA Fallback for Admin Panel
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

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

// One-time backfill endpoint: enriches old orders with product name/price
app.post('/api/admin/backfill-orders', async (req, res) => {
  try {
    const orders = await (prisma.order as any).findMany();
    let updated = 0;
    for (const order of orders) {
      try {
        let items: any[];
        try {
          items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
        } catch { continue; }
        const needsUpdate = items.some((it: any) => !it.name && it.productId);
        if (!needsUpdate) continue;
        const enrichedItems = await Promise.all(items.map(async (item: any) => {
          if (item.name || !item.productId) return item;
          try {
            const product = await (prisma.product as any).findUnique({
              where: { id: item.productId },
              select: { name: true, retailPrice: true, price: true }
            });
            if (product) {
              return { ...item, name: product.name, price: item.price || Number(product.retailPrice || product.price) || 0 };
            }
          } catch { }
          return item;
        }));
        await (prisma.order as any).update({ where: { id: order.id }, data: { items: JSON.stringify(enrichedItems) } });
        updated++;
      } catch { }
    }
    res.json({ success: true, message: `Updated ${updated} of ${orders.length} orders.` });
  } catch (error: any) {
    res.status(500).json({ error: 'Backfill failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
