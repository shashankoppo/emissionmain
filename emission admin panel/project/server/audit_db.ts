import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const settings = await prisma.setting.findMany();
    console.log('--- SMTP SETTINGS ---');
    settings.filter(s => s.key.toLowerCase().includes('smtp')).forEach(s => {
        console.log(`${s.key}: ${s.key.includes('pass') ? '***' : s.value}`);
    });

    const bannerCategories = await prisma.banner.findMany({ select: { category: true }, distinct: ['category'] });
    console.log('\n--- BANNER CATEGORIES IN DB ---');
    console.log(bannerCategories.map(b => b.category));

    const templates = await prisma.mailTemplate.findMany();
    console.log('\n--- MAIL TEMPLATES ---');
    templates.forEach(t => console.log(`${t.type}: Active=${t.active}`));

    process.exit(0);
}
check();
