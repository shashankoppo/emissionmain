import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
const products = [
    {
        id: 'sp-tshirt-001',
        name: 'Performance Training T-Shirt',
        slug: 'performance-training-tshirt',
        category: 'sportswear',
        subcategory: 'T-Shirts',
        description: 'Premium moisture-wicking training t-shirt engineered for peak athletic performance. Manufactured with advanced breathable fabric technology, ideal for sports teams, institutions, and bulk orders.',
        shortDescription: 'Moisture-wicking performance tee for athletes',
        price: 599,
        wholesalePrice: 399,
        images: JSON.stringify([
            'https://images.pexels.com/photos/8844356/pexels-photo-8844356.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        features: JSON.stringify([
            'Advanced moisture-wicking technology',
            'Anti-bacterial fabric treatment',
            'Reinforced stitching for durability',
            'Available in custom team colors',
            'GSM: 180-220'
        ]),
        specifications: JSON.stringify({
            'Material': '100% Polyester',
            'GSM': '180-220',
            'Sizes': 'XXS to 5XL',
            'MOQ': '50 pieces',
            'Customization': 'Logo, Colors, Design'
        }),
        inStock: true,
        moq: 50
    },
    {
        id: 'sp-tracksuit-001',
        name: 'Professional Sports Tracksuit',
        slug: 'professional-sports-tracksuit',
        category: 'sportswear',
        subcategory: 'Tracksuits',
        description: 'Complete tracksuit set manufactured for professional athletes and sports institutions. Premium quality fabric with superior durability for intensive training and competition use.',
        shortDescription: 'Professional grade tracksuit for teams',
        price: 1899,
        wholesalePrice: 1299,
        images: JSON.stringify([
            'https://images.pexels.com/photos/8844118/pexels-photo-8844118.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        features: JSON.stringify([
            'Full zip jacket with side pockets',
            'Elastic waistband with drawstring',
            'Breathable mesh lining',
            'Weather-resistant outer layer',
            'Custom branding available'
        ]),
        specifications: JSON.stringify({
            'Material': 'Polyester blend',
            'GSM': '250-280',
            'Sizes': 'S to 4XL',
            'MOQ': '30 sets',
            'Customization': 'Full customization available'
        }),
        inStock: true,
        moq: 30
    },
    {
        id: 'sp-jersey-001',
        name: 'Team Sports Jersey',
        slug: 'team-sports-jersey',
        category: 'sportswear',
        subcategory: 'Jerseys',
        description: 'Lightweight sports jersey designed for maximum performance. Perfect for football, cricket, athletics teams, schools, and government sports programs across Madhya Pradesh.',
        shortDescription: 'Lightweight performance jersey',
        price: 799,
        wholesalePrice: 549,
        images: JSON.stringify([
            'https://images.pexels.com/photos/8844283/pexels-photo-8844283.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        features: JSON.stringify([
            'Ultra-lightweight construction',
            'Quick-dry technology',
            'Sublimation printing compatible',
            'Mesh ventilation panels',
            'Ideal for bulk institutional orders'
        ]),
        specifications: JSON.stringify({
            'Material': '100% Polyester',
            'GSM': '140-160',
            'Sizes': 'XXS to 3XL',
            'MOQ': '25 pieces',
            'Customization': 'Numbers, names, logos'
        }),
        inStock: true,
        moq: 25
    },
    {
        id: 'sp-shorts-001',
        name: 'Athletic Training Shorts',
        slug: 'athletic-training-shorts',
        category: 'sportswear',
        subcategory: 'Shorts',
        description: 'High-performance athletic shorts with advanced fabric technology. Manufactured for sports academies, schools, and government athletic programs in Jabalpur and across India.',
        shortDescription: 'Breathable athletic shorts',
        price: 499,
        wholesalePrice: 349,
        images: JSON.stringify([
            'https://images.pexels.com/photos/7690986/pexels-photo-7690986.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        features: JSON.stringify([
            'Elastic waistband with drawcord',
            'Side mesh pockets',
            'Moisture-wicking fabric',
            'Anti-chafe inner lining',
            'Bulk order friendly'
        ]),
        specifications: JSON.stringify({
            'Material': 'Polyester blend',
            'GSM': '160-180',
            'Sizes': 'S to 3XL',
            'MOQ': '50 pieces',
            'Customization': 'Colors and logos'
        }),
        inStock: true,
        moq: 50
    },
    {
        id: 'mw-scrubs-001',
        name: 'Medical Scrubs Set',
        slug: 'medical-scrubs-set',
        category: 'medicalwear',
        subcategory: 'Scrubs',
        description: 'Professional medical scrubs manufactured for hospitals, clinics, and healthcare institutions. Durable, comfortable, and compliant with medical industry standards. Ideal for government hospital procurement.',
        shortDescription: 'Professional healthcare scrubs',
        price: 899,
        wholesalePrice: 649,
        images: JSON.stringify([
            'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        features: JSON.stringify([
            'Multiple utility pockets',
            'Easy-care fabric',
            'Color-fast and shrink-resistant',
            'Antimicrobial treatment available',
            'Hospital-grade quality'
        ]),
        specifications: JSON.stringify({
            'Material': 'Poly-cotton blend',
            'GSM': '180-200',
            'Sizes': 'XXS to 4XL',
            'MOQ': '100 sets',
            'Customization': 'Colors and embroidery'
        }),
        inStock: true,
        moq: 100
    },
    {
        id: 'mw-labcoat-001',
        name: 'Professional Lab Coat',
        slug: 'professional-lab-coat',
        category: 'medicalwear',
        subcategory: 'Lab Coats',
        description: 'Premium quality lab coats for medical professionals, laboratories, and pharmaceutical companies. Manufactured to meet institutional requirements for government and private sector procurement in Madhya Pradesh.',
        shortDescription: 'Premium medical lab coat',
        price: 1099,
        wholesalePrice: 799,
        images: JSON.stringify([
            'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        features: JSON.stringify([
            'Three front pockets',
            'Button-front closure',
            'Stain-resistant fabric',
            'Professional cut and fit',
            'Bulk institutional supply available'
        ]),
        specifications: JSON.stringify({
            'Material': '65% Polyester, 35% Cotton',
            'GSM': '200-220',
            'Sizes': 'S to 4XL',
            'MOQ': '50 pieces',
            'Customization': 'Embroidery, colors'
        }),
        inStock: true,
        moq: 50
    },
    {
        id: 'mw-uniform-001',
        name: 'Hospital Staff Uniform',
        slug: 'hospital-staff-uniform',
        category: 'medicalwear',
        subcategory: 'Hospital Uniforms',
        description: 'Complete hospital staff uniform manufactured for healthcare facilities. Designed for comfort during long shifts, suitable for nurses, attendants, and support staff in government and private hospitals.',
        shortDescription: 'Comfortable hospital staff uniform',
        price: 799,
        wholesalePrice: 599,
        images: JSON.stringify([
            'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        features: JSON.stringify([
            'Breathable fabric for all-day comfort',
            'Easy to maintain and wash',
            'Color-coded options available',
            'Professional appearance',
            'Government tender compliant'
        ]),
        specifications: JSON.stringify({
            'Material': 'Poly-cotton',
            'GSM': '170-190',
            'Sizes': 'S to 3XL',
            'MOQ': '100 pieces',
            'Customization': 'Colors and badges'
        }),
        inStock: true,
        moq: 100
    },
    {
        id: 'mw-ppe-001',
        name: 'PPE Medical Coveralls',
        slug: 'ppe-medical-coveralls',
        category: 'medicalwear',
        subcategory: 'PPE Clothing',
        description: 'Medical-grade PPE coveralls for healthcare workers and medical facilities. Manufactured to international safety standards for hospitals and healthcare institutions across India.',
        shortDescription: 'Medical-grade PPE coveralls',
        price: 399,
        wholesalePrice: 279,
        images: JSON.stringify([
            'https://images.pexels.com/photos/3902881/pexels-photo-3902881.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        features: JSON.stringify([
            'Fluid-resistant material',
            'Full-body coverage',
            'Elastic cuffs and ankles',
            'Front zipper closure',
            'Certified for medical use'
        ]),
        specifications: JSON.stringify({
            'Material': 'Non-woven fabric',
            'GSM': '60-80',
            'Sizes': 'M to XXL',
            'MOQ': '500 pieces',
            'Customization': 'Limited'
        }),
        inStock: true,
        moq: 500
    }
];
async function main() {
    console.log('🌱 Starting database seed...\n');
    // Seed admin account
    const adminEmail = 'admin@emission.com';
    const adminPassword = 'admin123';
    try {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = await prisma.admin.upsert({
            where: { email: adminEmail },
            update: {
                password: hashedPassword,
                name: 'Emission Admin',
            },
            create: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Emission Admin',
                role: 'admin',
            },
        });
        console.log('✅ Admin account created:');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${adminPassword}\n`);
    }
    catch (error) {
        console.error('❌ Error seeding admin:', error);
    }
    // Seed products
    console.log('📦 Seeding products...\n');
    for (const product of products) {
        try {
            await prisma.product.upsert({
                where: { id: product.id },
                update: product,
                create: product,
            });
            console.log(`✅ ${product.name}`);
        }
        catch (error) {
            console.error(`❌ Failed to seed ${product.name}:`, error);
        }
    }
    // Seed default banners
    console.log('🖼️ Seeding banners...\n');
    const defaultBanners = [
        {
            id: 'banner-1',
            title: 'Performance. Precision. Perfection.',
            subtitle: 'Premium sportswear and medical apparel engineered for professionals.',
            imageUrl: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&q=80',
            link: '/products',
            active: true,
            order: 1
        },
        {
            id: 'banner-2',
            title: 'Premium Quality. Medical Wear.',
            subtitle: 'Durable and comfortable medical gear for the healthcare heroes.',
            imageUrl: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80',
            link: '/category/medicalwear',
            active: true,
            order: 2
        }
    ];
    for (const banner of defaultBanners) {
        try {
            await prisma.banner.upsert({
                where: { id: banner.id },
                update: banner,
                create: banner,
            });
            console.log(`✅ Banner: ${banner.title}`);
        }
        catch (error) {
            console.error(`❌ Failed to seed banner:`, error);
        }
    }
    // Seed default settings
    console.log('⚙️ Seeding settings...\n');
    const defaultSettings = [
        { key: 'EMBROIDERY_PRICE', value: '250' },
        { key: 'smtp_host', value: 'smtp.hostinger.com' },
        { key: 'smtp_port', value: '465' },
        { key: 'smtp_user', value: 'care@emissionfit.com' },
        { key: 'smtp_pass', value: 'Mohit@121212' },
        { key: 'smtp_from', value: 'care@emissionfit.com' },
        { key: 'SITE_TITLE', value: 'Emission - Premium Sportswear & Medical Wear' },
        { key: 'SITE_DESCRIPTION', value: 'Premium OEM manufacturer of sportswear and medical wear engineered with precision. Born in Jabalpur, India.' },
    ];
    for (const setting of defaultSettings) {
        try {
            const existing = await prisma.setting.findUnique({ where: { key: setting.key } });
            if (!existing || !existing.value) {
                await prisma.setting.upsert({
                    where: { key: setting.key },
                    update: { value: setting.value },
                    create: { key: setting.key, value: setting.value },
                });
                console.log(`✅ Setting: ${setting.key}`);
            }
            else {
                console.log(`ℹ️ Setting ${setting.key} already exists, skipping.`);
            }
        }
        catch (error) {
            console.error(`❌ Failed to seed setting ${setting.key}:`, error);
        }
    }
    // Seed Mail Templates
    console.log('📧 Seeding mail templates...\n');
    const AppEmailModel = prisma.appEmail || prisma.emailTemplate || prisma.mailTemplate;
    if (AppEmailModel) {
        const templates = [
            {
                type: 'order_success',
                subject: 'Your Emission Order is Confirmed! 🎉',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Thank you, {{customerName}}! 🎉</h1><p style="color:#555">Your order has been confirmed and is being processed.</p><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Order ID:</strong> {{orderId}}</p><p style="margin:8px 0 0"><strong>Amount:</strong> ₹{{amount}}</p></div><p style="color:#555">We will notify you once your order ships. Thank you for choosing <strong>Emission</strong>.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'order_rejected',
                subject: 'Order Update from Emission',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Order Update</h1><p style="color:#555">Dear {{customerName}}, we regret to inform you that your order <strong>#{{orderId}}</strong> has been cancelled or rejected.</p><p style="color:#555">If you believe this is an error, please contact our support team at care@emissionfit.com.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'welcome_email',
                subject: 'Welcome to Emission — Your Account is Ready!',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Welcome, {{customerName}}! 👋</h1><p style="color:#555">Your account has been created on <strong>Emission</strong>, the leading OEM manufacturer of sportswear and medical wear from Jabalpur, India.</p><p style="color:#555">You can now browse and order our products, track your shipments, and manage your account easily.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'new_enquiry_admin',
                subject: 'New Enquiry Received — Emission Admin',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:20px">New Enquiry Received</h1><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Name:</strong> {{name}}</p><p style="margin:8px 0 0"><strong>Email:</strong> {{email}}</p><p style="margin:8px 0 0"><strong>Message:</strong> {{message}}</p></div><p style="color:#999;font-size:12px">Emission Admin Panel — ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            },
            {
                type: 'payment_success',
                subject: 'Payment Received — Emission',
                body: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;padding:32px;border-radius:12px;border:1px solid #e5e7eb"><h1 style="color:#111;font-size:24px">Payment Received! ✅</h1><p style="color:#555">We have successfully received your payment.</p><div style="background:#f9fafb;border-radius:8px;padding:16px;margin:20px 0"><p style="margin:0"><strong>Order ID:</strong> #{{orderId}}</p><p style="margin:8px 0 0"><strong>Amount Paid:</strong> ₹{{amount}}</p></div><p style="color:#555">Your order is now being processed. Thank you for shopping with <strong>Emission</strong>.</p><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="color:#999;font-size:12px">Technical Platform by ELSxGlobal Divission of Evolucentsphere Private Limited</p></div>`,
            }
        ];
        for (const t of templates) {
            await AppEmailModel.upsert({
                where: { type: t.type },
                update: { subject: t.subject, body: t.body, active: true },
                create: { type: t.type, subject: t.subject, body: t.body, active: true }
            });
            console.log(`✅ Template: ${t.type}`);
        }
    }
    // Seed default featured collections (Masterpieces)
    console.log('💎 Seeding featured collections...\n');
    const defaultCollections = [
        {
            id: 'col-1',
            title: 'Performance Sportswear',
            description: 'Engineered for athletes',
            imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80',
            link: '/products/sportswear',
            active: true,
            order: 1
        },
        {
            id: 'col-2',
            title: 'Medical Scrubs & Coats',
            description: 'Professional & Comfortable',
            imageUrl: 'https://images.unsplash.com/photo-1581595221475-79d150275510?auto=format&fit=crop&q=80',
            link: '/products/medicalwear',
            active: true,
            order: 2
        },
        {
            id: 'col-3',
            title: 'Custom Uniforms',
            description: 'Logos & Embroidery',
            imageUrl: 'https://images.unsplash.com/photo-1598501022238-79673b40090d?auto=format&fit=crop&q=80',
            link: '/contact',
            active: true,
            order: 3
        }
    ];
    for (const collection of defaultCollections) {
        try {
            await prisma.featuredCollection.upsert({
                where: { id: collection.id },
                update: collection,
                create: collection,
            });
            console.log(`✅ Collection: ${collection.title}`);
        }
        catch (error) {
            console.error(`❌ Failed to seed collection:`, error);
        }
    }
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Admin accounts: 1`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Banners: ${defaultBanners.length}`);
    console.log(`   - Collections: ${defaultCollections.length}`);
    console.log(`   - Settings: ${defaultSettings.length}`);
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
