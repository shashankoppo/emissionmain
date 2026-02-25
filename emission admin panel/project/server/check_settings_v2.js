import { PrismaClient } from '@prisma/client';
process.env.DATABASE_URL = "file:C:/Users/Shashank patel/Desktop/client codes/emission main/emission admin panel/project/server/prisma/dev.db";
const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.setting.findMany();
    console.log('--- SETTINGS IN DATABASE ---');
    settings.forEach(s => {
        const displayValue = s.key.includes('SECRET') ? '********' : s.value;
        console.log(`${s.key}: ${displayValue}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
