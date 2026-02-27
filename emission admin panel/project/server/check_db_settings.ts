import { PrismaClient } from '@prisma/client';

async function checkSettings() {
    const prisma = new PrismaClient();
    try {
        console.log('Checking settings in database...');
        const settings = await prisma.setting.findMany();
        console.log('Total settings found:', settings.length);
        settings.forEach(s => {
            if (s.key.includes('RAZORPAY')) {
                console.log(`Key: ${s.key}, Value length: ${s.value.length}, Start: ${s.value.substring(0, 8)}...`);
            } else {
                console.log(`Key: ${s.key}`);
            }
        });
    } catch (error) {
        console.error('Failed to check settings:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkSettings();
