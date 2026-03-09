import nodemailer from 'nodemailer';
import prisma from '../lib/db.js';

let transporter: nodemailer.Transporter | null = null;

// Helper to get the correct model name (unified with routes)
const getMailModel = () => (prisma as any).appEmail || (prisma as any).emailTemplate || (prisma as any).mailTemplate;

export const initTransporter = async () => {
    try {
        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from']
                }
            }
        });

        const config = settings.reduce((acc: any, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        if (!config.smtp_host || !config.smtp_user || !config.smtp_pass) {
            console.log('SMTP settings incomplete. Email service disabled.');
            transporter = null;
            return false;
        }

        transporter = nodemailer.createTransport({
            host: config.smtp_host,
            port: parseInt(config.smtp_port) || 587,
            secure: parseInt(config.smtp_port) === 465,
            auth: {
                user: config.smtp_user,
                pass: config.smtp_pass,
            },
            connectionTimeout: 10000, // 10 seconds timeout
            greetingTimeout: 10000,
        });

        // Verify connection with a timeout to prevent hanging the server
        console.log(`Verifying SMTP connection to ${config.smtp_host}...`);

        // We don't await verify() here if we want the server to start even with bad SMTP,
        // but we DO want to know if it works.
        try {
            await Promise.race([
                transporter.verify(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP Verification Timeout')), 8000))
            ]);
            console.log('✅ SMTP connection established successfully.');
            return true;
        } catch (vErr) {
            console.warn('⚠️ SMTP Verification failed (but settings saved):', (vErr as Error).message);
            // We keep the transporter even if verify fails once, maybe it's a temporary network glitch
            return true;
        }
    } catch (error) {
        console.error('Failed to initialize SMTP transporter:', error);
        transporter = null;
        return false;
    }
};

export const sendEmail = async (to: string, type: string, variables: Record<string, string> = {}) => {
    try {
        if (!transporter) {
            await initTransporter();
        }

        if (!transporter) {
            console.error('Cannot send email: SMTP not configured');
            return false;
        }

        const model = getMailModel();
        if (!model) {
            console.error('Cannot send email: Email template model not found in Prisma');
            return false;
        }

        const template = await model.findUnique({
            where: { type }
        });

        if (!template || !template.active) {
            console.log(`Mail template '${type}' is missing or inactive. Skipping email.`);
            return false;
        }

        const fromSetting = await prisma.setting.findUnique({ where: { key: 'smtp_from' } });
        const fromEmail = fromSetting?.value || 'noreply@emission.in';

        let subject = template.subject;
        let html = template.body;

        // Replace variables in subject and html
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            subject = subject.replace(regex, value);
            html = html.replace(regex, value);
        }

        const info = await transporter.sendMail({
            from: `"Emission" <${fromEmail}>`,
            to,
            subject,
            html,
        });

        console.log(`✅ Email sent successfully: ${info.messageId}`);
        return true;
    } catch (error: any) {
        console.error(`❌ FAILED to send email (${type}) to ${to}:`, error.message);
        if (error.code === 'EENVELOPE') console.error('  - Possible cause: Invalid sender or recipient address.');
        if (error.code === 'ETIMEDOUT') console.error('  - Possible cause: Firewall blocking outgoing port or wrong SMTP host.');
        if (error.code === 'EAUTH') console.error('  - Possible cause: SMTP authentication failed. Check credentials.');
        return false;
    }
};
