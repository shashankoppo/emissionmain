import prisma from './src/lib/db.js';

async function injectKeys() {
    const key_id = process.argv[2];
    const key_secret = process.argv[3];

    if (!key_id || !key_secret) {
        console.error('Usage: npx tsx inject_keys.ts <KEY_ID> <KEY_SECRET>');
        process.exit(1);
    }

    try {
        console.log('Injecting Razorpay keys into database...');

        await prisma.setting.upsert({
            where: { key: 'RAZORPAY_KEY_ID' },
            update: { value: key_id },
            create: { key: 'RAZORPAY_KEY_ID', value: key_id },
        });

        await prisma.setting.upsert({
            where: { key: 'RAZORPAY_KEY_SECRET' },
            update: { value: key_secret },
            create: { key: 'RAZORPAY_KEY_SECRET', value: key_secret },
        });

        console.log('✅ Keys injected successfully!');

        const settings = await prisma.setting.findMany({
            where: { key: { in: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'] } }
        });
        console.log('Current Database Content:', settings);

    } catch (error) {
        console.error('❌ Failed to inject keys:', error);
    } finally {
        await prisma.$disconnect();
    }
}

injectKeys();
