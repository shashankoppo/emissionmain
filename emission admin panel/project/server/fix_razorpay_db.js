import { PrismaClient } from '@prisma/client';

process.env.DATABASE_URL = "file:C:/Users/Shashank patel/Desktop/client codes/emission main/emission admin panel/project/server/prisma/dev.db";

const prisma = new PrismaClient();

async function main() {
    console.log('--- FORCING RAZORPAY KEYS INTO PRISMA/DEV.DB ---');

    const keys = {
        'RAZORPAY_KEY_ID': 'rzp_live_SJujanzPhniexS',
        'RAZORPAY_KEY_SECRET': 'kQjakl9JdHL5OtpkDsNygvQb'
    };

    for (const [key, value] of Object.entries(keys)) {
        console.log(`Upserting ${key}...`);
        await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    console.log('✅ Keys injected successfully!');

    const all = await prisma.setting.findMany();
    console.log('\nCurrent settings in DB:');
    all.forEach(s => {
        const val = s.key.includes('SECRET') ? '********' : s.value;
        console.log(`${s.key}: ${val}`);
    });
}

main()
    .catch(e => console.error('❌ Error:', e))
    .finally(() => prisma.$disconnect());
