import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function migrate() {
    const keys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
    for (const oldKey of keys) {
        const setting = await prisma.setting.findUnique({ where: { key: oldKey } });
        if (setting) {
            const newKey = oldKey.toLowerCase();
            console.log(`Migrating ${oldKey} -> ${newKey} (Value: ${oldKey.includes('PASS') ? '***' : setting.value})`);
            await prisma.setting.upsert({
                where: { key: newKey },
                update: { value: setting.value },
                create: { key: newKey, value: setting.value }
            });
            // Optionally delete the old uppercase key to avoid confusion
            // await prisma.setting.delete({ where: { key: oldKey } });
        }
    }
    console.log('Migration complete. Checking current settings...');
    const all = await prisma.setting.findMany();
    all.forEach(s => console.log(`${s.key}: ${s.key.includes('pass') ? '***' : s.value}`));
    process.exit(0);
}
migrate();
