import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
const prisma = new PrismaClient();
// Get all products (public)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: { variants: true }
            }),
            prisma.product.count()
        ]);
        res.json({
            data: products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    }
    catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
// Get single product (public)
router.get('/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: { variants: true }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error('Failed to fetch product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
// Create product (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, slug, category, subcategory, description, shortDescription, price, wholesalePrice, retailPrice, images, features, specifications, inStock, moq, availableSizes, availableColors, allowsEmbroidery, gstPercentage, shippingIncluded, sizeChart, metaTitle, metaDescription, metaKeywords, variants // Added variants
         } = req.body;
        // Validation
        if (!name || !slug || !category || !subcategory) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!price || price <= 0) {
            return res.status(400).json({ error: 'Invalid retail price' });
        }
        // Check if slug already exists
        const existingProduct = await prisma.product.findUnique({
            where: { slug }
        });
        if (existingProduct) {
            return res.status(400).json({ error: 'A product with this slug already exists' });
        }
        // Create product and variants in a transaction
        const product = await prisma.$transaction(async (tx) => {
            const newProduct = await tx.product.create({
                data: {
                    name,
                    slug,
                    category,
                    subcategory,
                    description: description || '',
                    shortDescription: shortDescription || '',
                    price: parseFloat(price),
                    wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : parseFloat(price),
                    retailPrice: retailPrice ? parseFloat(retailPrice) : parseFloat(price),
                    images: images || '[]',
                    features: features || '[]',
                    specifications: specifications || '{}',
                    inStock: inStock !== undefined ? inStock : true,
                    moq: parseInt(moq) || 1,
                    availableSizes: availableSizes || '[]',
                    availableColors: availableColors || '[]',
                    allowsEmbroidery: allowsEmbroidery !== undefined ? allowsEmbroidery : false,
                    gstPercentage: gstPercentage ? parseFloat(gstPercentage) : 18,
                    shippingIncluded: shippingIncluded !== undefined ? shippingIncluded : true,
                    sizeChart: sizeChart || null,
                    metaTitle: metaTitle || null,
                    metaDescription: metaDescription || null,
                    metaKeywords: metaKeywords || null,
                }
            });
            if (variants && Array.isArray(variants)) {
                await Promise.all(variants.map((v) => tx.productVariant.create({
                    data: {
                        productId: newProduct.id,
                        size: v.size,
                        color: v.color,
                        sku: v.sku,
                        stock: parseInt(v.stock) || 0,
                        priceAdjustment: parseFloat(v.priceAdjustment) || 0
                    }
                })));
            }
            return newProduct;
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error('SERVER ERROR: Failed to create product:', error);
        res.status(500).json({
            error: 'Failed to create product',
            details: error.message
        });
    }
});
// Update product (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, category, subcategory, description, shortDescription, price, wholesalePrice, retailPrice, images, features, specifications, inStock, moq, availableSizes, availableColors, allowsEmbroidery, gstPercentage, shippingIncluded, sizeChart, metaTitle, metaDescription, metaKeywords, variants // Added variants
         } = req.body;
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Check if slug is being changed and if it conflicts
        if (slug && slug !== existingProduct.slug) {
            const slugConflict = await prisma.product.findUnique({
                where: { slug }
            });
            if (slugConflict) {
                return res.status(400).json({ error: 'A product with this slug already exists' });
            }
        }
        // Update product and variants in a transaction
        const product = await prisma.$transaction(async (tx) => {
            const updatedProduct = await tx.product.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(slug && { slug }),
                    ...(category && { category }),
                    ...(subcategory && { subcategory }),
                    ...(description !== undefined && { description }),
                    ...(shortDescription !== undefined && { shortDescription }),
                    ...(price !== undefined && { price: parseFloat(price) }),
                    ...(wholesalePrice !== undefined && { wholesalePrice: parseFloat(wholesalePrice) }),
                    ...(retailPrice !== undefined && { retailPrice: retailPrice ? parseFloat(retailPrice) : parseFloat(price || existingProduct.price) }),
                    ...(images && { images }),
                    ...(features && { features }),
                    ...(specifications && { specifications }),
                    ...(inStock !== undefined && { inStock }),
                    ...(moq !== undefined && { moq: parseInt(moq) }),
                    ...(availableSizes !== undefined && { availableSizes }),
                    ...(availableColors !== undefined && { availableColors }),
                    ...(allowsEmbroidery !== undefined && { allowsEmbroidery }),
                    ...(gstPercentage !== undefined && { gstPercentage: parseFloat(gstPercentage) }),
                    ...(shippingIncluded !== undefined && { shippingIncluded }),
                    ...(sizeChart !== undefined && { sizeChart }),
                    ...(metaTitle !== undefined && { metaTitle }),
                    ...(metaDescription !== undefined && { metaDescription }),
                    ...(metaKeywords !== undefined && { metaKeywords }),
                }
            });
            if (variants && Array.isArray(variants)) {
                // Delete old variants that are not in the new list (or just replace all)
                // For simplicity and to avoid SKU conflicts during update, we can handle it carefully.
                // Actually, let's delete all existing variants and recreate them, or sync them.
                // SYNC approach:
                await tx.productVariant.deleteMany({ where: { productId: id } });
                await Promise.all(variants.map((v) => tx.productVariant.create({
                    data: {
                        productId: id,
                        size: v.size,
                        color: v.color,
                        sku: v.sku,
                        stock: parseInt(v.stock) || 0,
                        priceAdjustment: parseFloat(v.priceAdjustment) || 0
                    }
                })));
            }
            return updatedProduct;
        });
        res.json(product);
    }
    catch (error) {
        console.error('SERVER ERROR: Failed to update product:', error);
        res.status(500).json({
            error: 'Failed to update product',
            details: error.message
        });
    }
});
// Delete product (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await prisma.product.delete({ where: { id } });
        res.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('Failed to delete product:', error);
        res.status(500).json({
            error: 'Failed to delete product',
            details: error.message
        });
    }
});
export default router;
