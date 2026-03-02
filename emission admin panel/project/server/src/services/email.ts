import nodemailer from 'nodemailer';
import prisma from '../lib/db.js';

let transporter: nodemailer.Transporter | null = null;

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
        });

        // Verify connection
        await transporter.verify();
        console.log('SMTP connection established successfully.');
        return true;
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

        const template = await prisma.mailTemplate.findUnique({
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

        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`Failed to send email (${type}) to ${to}:`, error);
        return false;
    }
};

// Initialize on startup
initTransporter();
