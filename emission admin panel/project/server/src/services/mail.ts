import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function sendMail(to: string, subject: string, html: string) {
    try {
        // Fetch SMTP settings from database
        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    in: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM']
                }
            }
        });

        const settingsMap = settings.reduce((acc: Record<string, string>, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        if (!settingsMap.SMTP_HOST || !settingsMap.SMTP_USER || !settingsMap.SMTP_PASS) {
            console.warn('SMTP settings not fully configured. Email not sent.');
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: settingsMap.SMTP_HOST,
            port: parseInt(settingsMap.SMTP_PORT) || 587,
            secure: parseInt(settingsMap.SMTP_PORT) === 465,
            auth: {
                user: settingsMap.SMTP_USER,
                pass: settingsMap.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: settingsMap.SMTP_FROM || `"Emission" <${settingsMap.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}
