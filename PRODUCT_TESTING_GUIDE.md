# Product Management - Testing Guide

## ✅ Fixed Issues

### 1. Product Save Functionality
- ✅ Fixed data serialization for features and specifications
- ✅ Added proper validation before saving
- ✅ Improved error handling with detailed messages
- ✅ Auto-generate slug from product name

### 2. Image Upload
- ✅ Created uploads directory automatically
- ✅ Added file type validation (JPEG, PNG, GIF, WebP only)
- ✅ Added file size limit (5MB max)
- ✅ Better error messages for upload failures
- ✅ Unique filename generation to prevent conflicts

### 3. Form Improvements
- ✅ Dynamic features list (add/remove)
- ✅ Dynamic specifications (key-value pairs)
- ✅ Auto-slug generation from product name
- ✅ Character counter for short description
- ✅ Primary image indicator
- ✅ Better UI/UX with loading states

## 🧪 How to Test Product Creation

### Step 1: Login to Admin Panel
1. Open http://localhost:5173
2. Login with:
   - Email: `admin@emission.com`
   - Password: `123`

### Step 2: Navigate to Products
1. Click "Products" in the sidebar
2. Click "Add Product" button

### Step 3: Fill Product Details

#### Basic Information
- **Product Name**: `Premium Sports Jersey`
  - Slug will auto-generate: `premium-sports-jersey`
- **Category**: Select `Sportswear`
- **Subcategory**: `Jerseys`

#### Pricing & Stock
- **Retail Price**: `899`
- **Wholesale Price**: `649`
- **MOQ**: `25`
- ✅ Check "In Stock"

#### Descriptions
- **Short Description**: `High-performance jersey for athletes`
- **Full Description**: 
  ```
  Premium quality sports jersey manufactured with advanced moisture-wicking 
  technology. Perfect for football, cricket, and athletics teams. Suitable 
  for schools, colleges, and sports institutions across India.
  ```

#### Images
1. Click the upload box
2. Select an image (max 5MB)
3. Wait for upload to complete
4. Add more images if needed
5. First image will be the primary image

#### Features
1. Default feature field is shown
2. Enter: `Moisture-wicking fabric`
3. Click "+ Add Feature"
4. Enter: `Quick-dry technology`
5. Click "+ Add Feature"
6. Enter: `Sublimation printing compatible`
7. Add more as needed
8. Remove unwanted features with trash icon

#### Specifications
1. Enter Key: `Material`
2. Enter Value: `100% Polyester`
3. Click "+" button
4. Repeat for more specifications:
   - `GSM`: `140-160`
   - `Sizes`: `XS to 3XL`
   - `MOQ`: `25 pieces`
   - `Customization`: `Numbers, names, logos`

### Step 4: Save Product
1. Click "Create Product" button
2. Wait for "Product saved successfully!" message
3. Form will close automatically
4. New product appears in the list

## 🔍 Verify Product on Customer Website

### Step 1: Open Customer Website
1. Open http://localhost:5174
2. Click "Products" in navigation

### Step 2: Find Your Product
1. Filter by category if needed
2. Your new product should appear
3. Click on the product card

### Step 3: Verify Details
- ✅ All images display correctly
- ✅ Price and wholesale price shown
- ✅ Features list displayed
- ✅ Specifications table populated
- ✅ Description matches

## 📝 Test Product Editing

### Step 1: Edit Product
1. Go to Admin Panel → Products
2. Click edit icon (pencil) on any product
3. Form opens with existing data

### Step 2: Make Changes
- Change price
- Add/remove features
- Upload new images
- Update specifications

### Step 3: Save Changes
1. Click "Update Product"
2. Verify changes on customer website

## 🗑️ Test Product Deletion

1. Go to Admin Panel → Products
2. Click delete icon (trash) on a product
3. Confirm deletion
4. Product removed from list
5. Verify product no longer appears on customer website

## 🐛 Common Issues & Solutions

### Issue: "Failed to upload image"
**Solutions**:
- Check file size (must be < 5MB)
- Check file type (JPEG, PNG, GIF, WebP only)
- Ensure you're logged in
- Check server is running on port 3001

### Issue: "Failed to save product"
**Solutions**:
- Ensure all required fields are filled
- Check at least one image is uploaded
- Check at least one feature is added
- Verify prices are greater than 0
- Check slug is unique

### Issue: "A product with this slug already exists"
**Solutions**:
- Change the product name slightly
- Or manually edit the slug to make it unique

### Issue: Images not displaying
**Solutions**:
- Check uploads directory exists: `server/uploads/`
- Verify backend server is running
- Check image URLs in database

### Issue: Features/Specifications not saving
**Solutions**:
- Ensure features are not empty
- For specifications, both key and value must be filled
- Click the "+" button to add specifications

## 📊 Sample Product Data

### Example 1: Sportswear Product
```
Name: Athletic Training Shorts
Category: Sportswear
Subcategory: Shorts
Price: 499
Wholesale Price: 349
MOQ: 50
Short Description: Breathable athletic shorts for training
Description: High-performance athletic shorts with advanced fabric technology...

Features:
- Elastic waistband with drawcord
- Side mesh pockets
- Moisture-wicking fabric
- Anti-chafe inner lining

Specifications:
Material: Polyester blend
GSM: 160-180
Sizes: S to 3XL
MOQ: 50 pieces
```

### Example 2: Medical Wear Product
```
Name: Professional Lab Coat
Category: Medical Wear
Subcategory: Lab Coats
Price: 1099
Wholesale Price: 799
MOQ: 50
Short Description: Premium medical lab coat
Description: Premium quality lab coats for medical professionals...

Features:
- Three front pockets
- Button-front closure
- Stain-resistant fabric
- Professional cut and fit

Specifications:
Material: 65% Polyester, 35% Cotton
GSM: 200-220
Sizes: S to 4XL
MOQ: 50 pieces
```

## ✨ New Features Added

### 1. Auto-Slug Generation
- Slug automatically generates from product name
- Converts to lowercase
- Replaces spaces with hyphens
- Removes special characters

### 2. Dynamic Features
- Add unlimited features
- Remove individual features
- Reorder by editing

### 3. Specifications Manager
- Add key-value pairs
- Remove specifications
- Visual display of all specs

### 4. Image Management
- Multiple image upload
- Remove individual images
- Primary image indicator
- Image preview before upload

### 5. Validation
- Required field indicators (*)
- Character counter for short description
- Price validation
- File size/type validation

## 🎯 Success Criteria

A product is successfully created when:
- ✅ Appears in admin products list
- ✅ Visible on customer website
- ✅ All images display correctly
- ✅ Features list shows properly
- ✅ Specifications table populated
- ✅ Prices display correctly
- ✅ Can be edited and updated
- ✅ Can be deleted

## 📞 Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Check server terminal for error messages
3. Verify all services are running
4. Check database connection
5. Review this testing guide

---

**Status**: ✅ All features tested and working
**Last Updated**: February 12, 2026
