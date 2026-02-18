# 🚀 QUICK REFERENCE CARD

## 🌐 Access URLs
- **Customer Website**: http://localhost:5174
- **Admin Panel**: http://localhost:5173
- **API Health**: http://localhost:3001/api/health

## 🔑 Admin Login
- **Email**: `admin@emission.com`
- **Password**: `123`

## 📦 Product Count
- **Total**: 16 products
- **Sportswear**: 8 products
- **Medical Wear**: 8 products

## 💳 Razorpay Setup (3 Steps)
1. `npm install razorpay` (in server directory)
2. Add keys to `.env` files
3. Restart backend server

## 🐛 Quick Fixes

### Products Won't Save?
1. Login to admin panel
2. Check backend running (port 3001)
3. Fill all required fields (*)
4. Upload at least 1 image
5. Add at least 1 feature

### Can't Login?
- Email: `admin@emission.com`
- Password: `123`
- Clear browser cache if needed

### Images Not Uploading?
- Max size: 5MB
- Formats: JPEG, PNG, GIF, WebP
- Check you're logged in

## 📝 Create Product (Quick Steps)
1. Login → Products → Add Product
2. Fill name (slug auto-generates)
3. Select category
4. Set prices
5. Upload images
6. Add features
7. Add specifications
8. Click "Create Product"

## 🔄 Reset Database
```bash
cd "emission admin panel/project/server"
rm prisma/dev.db
npx prisma migrate dev
npm run seed
```

## 📊 Check System Status
```bash
# Check backend
curl http://localhost:3001/api/health

# Check products
curl http://localhost:3001/api/products

# Count products
curl http://localhost:3001/api/products | jq length
```

## 📚 Documentation Files
1. `FINAL_STATUS_REPORT.md` - Complete overview
2. `COMPLETE_ENHANCEMENT_GUIDE.md` - Full guide
3. `HOW_TO_ADD_PRODUCTS.md` - Product creation
4. `PRODUCT_TESTING_GUIDE.md` - Testing
5. `PROJECT_REPORT.md` - Technical docs
6. `QUICK_START.md` - Getting started

## 🎯 Common Commands
```bash
# Start backend
cd "emission admin panel/project"
npm run dev

# Start frontend
cd "emission/project"
npm run dev

# View database
cd "emission admin panel/project/server"
npx prisma studio

# Seed database
npm run seed --workspace=server
```

## ✅ System Checklist
- [ ] Backend running on port 3001
- [ ] Admin panel on port 5173
- [ ] Customer site on port 5174
- [ ] Can login to admin
- [ ] Can view products
- [ ] Can create products
- [ ] Images uploading
- [ ] Products visible on customer site

## 🆘 Need Help?
1. Check browser console (F12)
2. Check server terminal
3. Read documentation files
4. Verify all services running

---

**Quick Tip**: Bookmark this page for instant reference!

**Status**: ✅ All Systems Operational
**Version**: 3.0.0
**Date**: February 12, 2026
