import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const newProducts = [
    // Additional Sportswear Products
    {
        id: 'sp-hoodie-001',
        name: 'Premium Sports Hoodie',
        slug: 'premium-sports-hoodie',
        category: 'sportswear',
        subcategory: 'Hoodies',
        description: 'Premium quality sports hoodie designed for athletes and sports teams. Features advanced fabric technology for warmth and comfort during training sessions and outdoor activities. Perfect for schools, colleges, and sports academies across India.',
        shortDescription: 'Warm and comfortable sports hoodie',
        price: 1299,
        wholesalePrice: 899,
        images: JSON.stringify(['https://images.pexels.com/photos/8844089/pexels-photo-8844089.jpeg?auto=compress&cs=tinysrgb&w=800']),
        features: JSON.stringify([
            'Fleece-lined interior for warmth',
            'Kangaroo pocket with zipper',
            'Adjustable drawstring hood',
            'Ribbed cuffs and hem',
            'Custom logo embroidery available'
        ]),
        specifications: JSON.stringify({
            'Material': '80% Cotton, 20% Polyester',
            'GSM': '280-320',
            'Sizes': 'S to 3XL',
            'MOQ': '30 pieces',
            'Customization': 'Logo, colors, design'
        }),
        inStock: true,
        moq: 30
    },
    {
        id: 'sp-joggers-001',
        name: 'Athletic Training Joggers',
        slug: 'athletic-training-joggers',
        category: 'sportswear',
        subcategory: 'Track Pants',
        description: 'High-performance training joggers manufactured for athletes and fitness enthusiasts. Designed with moisture-wicking fabric and ergonomic fit for maximum comfort during workouts and training sessions.',
        shortDescription: 'Comfortable training joggers',
        price: 899,
        wholesalePrice: 649,
        images: JSON.stringify(['https://images.pexels.com/photos/7690975/pexels-photo-7690975.jpeg?auto=compress&cs=tinysrgb&w=800']),
        features: JSON.stringify([
            'Tapered fit design',
            'Elastic waistband with drawstring',
            'Zippered side pockets',
            'Ankle cuffs for secure fit',
            'Moisture-wicking fabric'
        ]),
        specifications: JSON.stringify({
            'Material': 'Polyester blend',
            'GSM': '200-220',
            'Sizes': 'S to 3XL',
            'MOQ': '40 pieces',
            'Customization': 'Colors and logos'
        }),
        inStock: true,
        moq: 40
    },
    {
        id: 'sp-polo-001',
        name: 'Sports Polo T-Shirt',
        slug: 'sports-polo-tshirt',
        category: 'sportswear',
        subcategory: 'T-Shirts',
        description: 'Classic polo t-shirt designed for sports teams and institutions. Features breathable fabric and professional appearance, suitable for team uniforms, corporate sports events, and institutional requirements.',
        shortDescription: 'Professional sports polo shirt',
        price: 699,
        wholesalePrice: 499,
        images: JSON.stringify(['https://images.pexels.com/photos/8844282/pexels-photo-8844282.jpeg?auto=compress&cs=tinysrgb&w=800']),
        features: JSON.stringify([
            'Collar design for professional look',
            'Breathable pique fabric',
            'Reinforced shoulder seams',
            'Available in multiple colors',
            'Team logo customization'
        ]),
        specifications: JSON.stringify({
            'Material': '100% Cotton pique',
            'GSM': '180-200',
            'Sizes': 'XS to 4XL',
            'MOQ': '50 pieces',
            'Customization': 'Logo, colors'
        }),
        inStock: true,
        moq: 50
    },
    {
        id: 'sp-compression-001',
        name: 'Compression Training Wear',
        slug: 'compression-training-wear',
        category: 'sportswear',
        subcategory: 'Compression Wear',
        description: 'Professional compression wear designed for athletes and fitness training. Provides muscle support and enhances performance during intensive workouts. Manufactured with advanced compression fabric technology.',
        shortDescription: 'Performance compression wear',
        price: 1099,
        wholesalePrice: 799,
        images: JSON.stringify(['https://images.pexels.com/photos/8844120/pexels-photo-8844120.jpeg?auto=compress&cs=tinysrgb&w=800']),
        features: JSON.stringify([
            'Graduated compression technology',
            'Muscle support and recovery',
            'Four-way stretch fabric',
            'Flatlock seams for comfort',
            'UV protection'
        ]),
        specifications: JSON.stringify({
            'Material': 'Spandex blend',
            'GSM': '220-240',
            'Sizes': 'S to 2XL',
            'MOQ': '25 pieces',
            'Customization': 'Limited'
        }),
        inStock: true,
        moq: 25
    },
    // Additional Medical Wear Products
    {
        id: 'mw-nurse-uniform-001',
        name: 'Nurse Uniform Set',
        slug: 'nurse-uniform-set',
        category: 'medicalwear',
        subcategory: 'Hospital Uniforms',
        description: 'Professional nurse uniform manufactured for healthcare facilities. Designed for comfort, durability, and professional appearance. Suitable for hospitals, clinics, and nursing homes across India.',
        shortDescription: 'Professional nurse uniform',
        price: 999,
        wholesalePrice: 749,
        images: JSON.stringify(['https://images.pexels.com/photos/8460171/pexels-photo-8460171.jpeg?auto=compress&cs=tinysrgb&w=800']),
        features: JSON.stringify([
            'Comfortable all-day wear',
            'Multiple pockets for utility',
            'Easy to clean and maintain',
            'Professional appearance',
            'Color-coded options'
        ]),
        specifications: JSON.stringify({
            'Material': 'Poly-cotton blend',
            'GSM': '180-200',
            'Sizes': 'S to 4XL',
            'MOQ': '100 sets',
            'Customization': 'Colors and badges'
        }),
        inStock: true,
        moq: 100
    },
    {
        id: 'mw-surgical-gown-001',
        name: 'Surgical Gown',
        slug: 'surgical-gown',
        category: 'medicalwear',
        subcategory: 'Surgical Wear',
        description: 'Medical-grade surgical gown manufactured to international standards. Provides barrier protection for healthcare professionals during surgical procedures. Suitable for hospitals and surgical centers.',
        shortDescription: 'Medical-grade surgical gown',
        price: 599,
        wholesalePrice: 449,
        images: JSON.stringify(['https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=800']),
        features: JSON.stringify([
            'Fluid-resistant material',
            'Sterile packaging available',
            'Tie-back closure',
            'Full coverage design',
            'Disposable or reusable options'
        ]),
        specifications: JSON.stringify({
            'Material': 'Non-woven fabric',
            'GSM': '40-60',
            'Sizes': 'Universal',
            'MOQ': '200 pieces',
            'Customization': 'Limited'
        }),
        inStock: true,
        moq: 200
    },
    {
        id: 'mw-doctor-coat-001',
        name: 'Doctor Apron Coat',
        slug: 'doctor-apron-coat',
        category: 'medicalwear',
        subcategory: 'Lab Coats',
        description: 'Premium doctor apron coat for medical professionals. Features professional design with multiple pockets and comfortable fit. Ideal for hospitals, clinics, and medical institutions.',
        shortDescription: 'Professional doctor apron',
        price: 1199,
        wholesalePrice: 899,
        images: JSON.stringify(['https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=800']),
        features: JSON.stringify([
            'Half-sleeve design',
            'Multiple utility pockets',
            'Stain-resistant fabric',
            'Professional white color',
            'Embroidery customization'
        ]),
        specifications: JSON.stringify({
            'Material': '65% Polyester, 35% Cotton',
            'GSM': '200-220',
            'Sizes': 'M to 3XL',
            'MOQ': '50 pieces',
            'Customization': 'Name embroidery'
        }),
        inStock: true,
        moq: 50
    },
    {
        id: 'mw-patient-gown-001',
        name: 'Patient Hospital Gown',
        slug: 'patient-hospital-gown',
        category: 'medicalwear',
        subcategory: 'Hospital Uniforms',
        description: 'Comfortable patient gown manufactured for hospitals and healthcare facilities. Designed for easy wear and patient comfort. Available in bulk quantities for institutional procurement.',
        shortDescription: 'Comfortable patient gown',
        price: 399,
        wholesalePrice: 299,
        images: JSON.stringify(['https://images.pexels.com/photos/8460169/pexels-photo-8460169.jpeg?auto=compress&cs=tinysrgb&w=800']),
        features: JSON.stringify([
            'Easy-wear design',
            'Soft and comfortable fabric',
            'Tie-back closure',
            'Machine washable',
            'Available in multiple colors'
        ]),
        specifications: JSON.stringify({
            'Material': '100% Cotton',
            'GSM': '140-160',
            'Sizes': 'One size fits all',
            'MOQ': '200 pieces',
            'Customization': 'Colors'
        }),
        inStock: true,
        moq: 200
    }
];

async function main() {
    console.log('🌱 Starting enhanced database seeding...\n');

    // Seed admin (if not exists)
    console.log('👤 Checking admin account...');
    const existingAdmin = await prisma.admin.findUnique({
        where: { email: 'admin@emission.com' }
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('123', 10);
        await prisma.admin.create({
            data: {
                email: 'admin@emission.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'admin'
            }
        });
        console.log('✅ Admin account created\n');
    } else {
        console.log('✅ Admin account already exists\n');
    }

    // Seed new products
    console.log('📦 Seeding new products...\n');

    for (const product of newProducts) {
        try {
            await prisma.product.upsert({
                where: { id: product.id },
                update: product,
                create: product,
            });
            console.log(`✅ ${product.name}`);
        } catch (error) {
            console.error(`❌ Failed to seed ${product.name}:`, error);
        }
    }

    console.log('\n✨ Enhanced seeding completed!');
    console.log(`\n📊 Total products in database: ${await prisma.product.count()}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
