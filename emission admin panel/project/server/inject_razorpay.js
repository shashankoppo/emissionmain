import { PrismaClient } from '@prisma/client';
import readline from 'readline';

// Point to the correct database file
process.env.DATABASE_URL = "file:C:/Users/Shashank patel/Desktop/client codes/emission main/emission admin panel/project/server/prisma/dev.db";

const prisma = new PrismaClient();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function inject() {
    console.log('--- RAZORPAY KEY INJECTOR ---');

    const keyId = await new Promise(resolve => rl.question('Enter Razorpay Key ID (rzp_live_...): ', resolve));
    const keySecret = await new Promise(resolve => rl.question('Enter Razorpay Key Secret: ', resolve));

    if (!keyId || !keySecret) {
        console.log('Error: Both Key ID and Secret are required.');
        process.exit(1);
    }

    try {
        console.log('\nSaving to database...');

        await prisma.setting.upsert({
            where: { key: 'RAZORPAY_KEY_ID' },
            update: { value: keyId.trim() },
            create: { key: 'RAZORPAY_KEY_ID', value: keyId.trim() },
        });

        await prisma.setting.upsert({
            where: { key: 'RAZORPAY_KEY_SECRET' },
            update: { value: keySecret.trim() },
            create: { key: 'RAZORPAY_KEY_SECRET', value: keySecret.trim() },
        });

        console.log('✅ Settings saved successfully!');

        // Verify
        const settings = await prisma.setting.findMany();
        console.log('\nVerified database content:');
        settings.forEach(s => {
            if (s.key.includes('RAZORPAY')) {
                const val = s.key.includes('SECRET') ? '********' : s.value;
                console.log(`${s.key}: ${val}`);
            }
        });

    } catch (error) {
        console.error('❌ Failed to save settings:', error);
    } finally {
        await prisma.$disconnect();
        rl.close();
    }
}

inject();
