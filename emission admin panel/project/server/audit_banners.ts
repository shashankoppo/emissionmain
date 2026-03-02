import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const banners = await prisma.banner.findMany();
    console.log('--- ALL BANNERS ---');
    banners.forEach(b => {
        console.log(`Banner: '${b.title}' | Category: '${b.category}' | Active: ${b.active}`);
    });
    process.exit(0);
}
check();
