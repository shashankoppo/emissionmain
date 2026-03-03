import nodemailer from 'nodemailer';
import prisma from '../lib/db.js';

let transporter = null;

const getMailModel = () => (prisma).appEmail || (prisma).emailTemplate || (prisma).mailTemplate;

export const initTransporter = async () => {
    try {
        const settings = await prisma.setting.findMany({
            where: { key: { in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'] } }
        });

        const config = settings.reduce((acc, curr) => {
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
            connectionTimeout: 10000,
            greetingTimeout: 10000,
        });

        console.log(`Verifying SMTP connection to ${config.smtp_host}...`);

        try {
            await Promise.race([
                transporter.verify(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP Verification Timeout')), 8000))
            ]);
            console.log('✅ SMTP connection established successfully.');
            return true;
        } catch (vErr) {
            console.warn('⚠️ SMTP Verification failed (but settings saved):', vErr.message);
            return true;
        }
    } catch (error) {
        console.error('Failed to initialize SMTP transporter:', error);
        transporter = null;
        return false;
    }
};

export const sendEmail = async (to, type, variables = {}) => {
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
            console.error('Cannot send email: Email model not found');
            return false;
        }

        const template = await model.findUnique({ where: { type } });

        if (!template || !template.active) {
            console.log(`Mail template '${type}' is missing or inactive.`);
            return false;
        }

        const fromSetting = await prisma.setting.findUnique({ where: { key: 'smtp_from' } });
        const fromEmail = fromSetting?.value || 'noreply@emission.in';

        let subject = template.subject;
        let html = template.body;

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

        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`Failed to send email (${type}) to ${to}:`, error);
        return false;
    }
};
