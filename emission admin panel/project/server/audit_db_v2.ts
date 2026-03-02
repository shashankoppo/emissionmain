import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const settings = await prisma.setting.findMany();
    console.log('--- ALL SETTINGS ---');
    settings.forEach(s => {
        console.log(`'${s.key}': '${s.key.includes('pass') ? '***' : s.value}'`);
    });
    process.exit(0);
}
check();
