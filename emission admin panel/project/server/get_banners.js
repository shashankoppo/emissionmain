import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const banners = await prisma.banner.findMany({
        orderBy: { order: 'asc' }
    });

    console.log('--- ACTIVE BANNERS ---');
    banners.forEach((b, i) => {
        console.log(`Banner ${i + 1}:`);
        console.log(`Title: ${b.title || 'No Title'}`);
        console.log(`Image URL: ${b.imageUrl}`);
        console.log('---------------------');
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
