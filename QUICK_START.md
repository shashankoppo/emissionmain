# Emission E-Commerce - Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Start All Services

Open **3 terminals** and run the following commands:

#### Terminal 1: Backend API Server
```bash
cd "c:\Users\Shashank patel\Desktop\client codes\emission main\emission admin panel\project"
npm run dev
```
✅ Backend API will start on **http://localhost:3001**

#### Terminal 2: Customer Website
```bash
cd "c:\Users\Shashank patel\Desktop\client codes\emission main\emission\project"
npm run dev
```
✅ Customer website will start on **http://localhost:5174**

#### Terminal 3: Admin Panel (Optional - runs with backend)
The admin panel frontend is already running with the backend on **http://localhost:5173**

---

## 🌐 Access URLs

### Customer Website
**URL**: http://localhost:5174

**Features**:
- Browse 8 products (4 sportswear + 4 medical wear)
- Filter by category and subcategory
- View product details with specifications
- Submit enquiries
- Contact forms

### Admin Panel
**URL**: http://localhost:5173/login

**Login Credentials**:
- **Email**: `admin@emission.com`
- **Password**: `123`

**Features**:
- Manage products (Create, Edit, Delete)
- View customer enquiries
- Track orders
- Update stock status

### Backend API
**URL**: http://localhost:3001/api

**Health Check**: http://localhost:3001/api/health

**Available Endpoints**:
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/enquiries` - Submit enquiry
- `POST /api/auth/login` - Admin login

---

## 📦 Product Catalog

### Sportswear (4 products)
1. **Performance Training T-Shirt** - ₹599 (Wholesale: ₹399, MOQ: 50)
2. **Professional Sports Tracksuit** - ₹1,899 (Wholesale: ₹1,299, MOQ: 30)
3. **Team Sports Jersey** - ₹799 (Wholesale: ₹549, MOQ: 25)
4. **Athletic Training Shorts** - ₹499 (Wholesale: ₹349, MOQ: 50)

### Medical Wear (4 products)
1. **Medical Scrubs Set** - ₹899 (Wholesale: ₹649, MOQ: 100)
2. **Professional Lab Coat** - ₹1,099 (Wholesale: ₹799, MOQ: 50)
3. **Hospital Staff Uniform** - ₹799 (Wholesale: ₹599, MOQ: 100)
4. **PPE Medical Coveralls** - ₹399 (Wholesale: ₹279, MOQ: 500)

---

## 🔧 Common Tasks

### Reset Database
```bash
cd "c:\Users\Shashank patel\Desktop\client codes\emission main\emission admin panel\project"
npm run seed --workspace=server
```

### View Database
The SQLite database is located at:
```
emission admin panel\project\server\prisma\dev.db
```

Use any SQLite viewer or:
```bash
cd server
npx prisma studio
```

### Add New Products
1. Login to admin panel: http://localhost:5173
2. Navigate to Products
3. Click "Add Product"
4. Fill in all details
5. Save

### View Enquiries
1. Login to admin panel
2. Navigate to Enquiries
3. View all customer enquiries with contact details

---

## 🐛 Troubleshooting

### Port Already in Use
If you see "Port already in use" error:

**Windows**:
```powershell
# Find process using port 3001
netstat -ano | findstr :3001
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Issues
```bash
# Reset database
cd "emission admin panel\project\server"
rm prisma/dev.db
npm run prisma:migrate --workspace=server
npm run seed --workspace=server
```

### Module Not Found
```bash
# Reinstall dependencies
npm install
```

### API Connection Failed
1. Check backend is running on port 3001
2. Verify `.env` file exists in `emission/project` with:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```
3. Restart the frontend dev server

---

## 📝 Testing Checklist

### Customer Website
- [ ] Visit http://localhost:5174
- [ ] Click on "Products" in navigation
- [ ] Filter products by "Sportswear"
- [ ] Click on any product to view details
- [ ] Click "Request Bulk Quote"
- [ ] Fill and submit enquiry form
- [ ] Check success message

### Admin Panel
- [ ] Visit http://localhost:5173
- [ ] Login with credentials
- [ ] View products list
- [ ] Click "Add Product"
- [ ] Create a new product
- [ ] Edit an existing product
- [ ] View enquiries
- [ ] Logout

### API
- [ ] Visit http://localhost:3001/api/health
- [ ] Should see: `{"status":"ok","message":"Emission Admin API is running"}`
- [ ] Visit http://localhost:3001/api/products
- [ ] Should see JSON array of 8 products

---

## 📚 Documentation

- **Integration Plan**: `INTEGRATION_PLAN.md`
- **Full Project Report**: `PROJECT_REPORT.md`
- **This Guide**: `QUICK_START.md`

---

## 🎯 Next Steps

1. **Test the integration**:
   - Browse products on customer site
   - Add/edit products in admin panel
   - Verify changes appear on customer site

2. **Customize**:
   - Update company information in Contact page
   - Add your own product images
   - Modify branding and colors

3. **Deploy**:
   - Follow deployment guide in `PROJECT_REPORT.md`
   - Set up production database
   - Configure environment variables

---

## 💡 Tips

- **Hot Reload**: Both frontend and backend support hot reload. Changes will reflect automatically.
- **Database Browser**: Use Prisma Studio (`npx prisma studio`) to view/edit database directly.
- **API Testing**: Use Postman or Thunder Client to test API endpoints.
- **Logs**: Check terminal output for errors and debugging information.

---

## 🆘 Support

If you encounter any issues:
1. Check terminal logs for error messages
2. Verify all services are running
3. Check database connection
4. Restart dev servers
5. Clear browser cache

---

**Status**: ✅ All systems operational
**Version**: 1.0.0
**Last Updated**: February 12, 2026
