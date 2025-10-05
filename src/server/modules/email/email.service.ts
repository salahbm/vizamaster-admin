import { getTranslations } from 'next-intl/server';

import nodemailer from 'nodemailer';

import { BRAND } from '@/constants/brand';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    // Get translations in English (default)
    const t = await getTranslations('auth.resetPassword');

    try {
      const info = await this.transporter.sendMail({
        from: `"${BRAND.name}" <${process.env.SMTP_USER}>`,
        to,
        subject: t('emailSubject', { brand: BRAND.name }),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${t('emailTitle')}</h2>
            <p>${t('emailDescription')}</p>
            <p>${t('emailInstructions')}</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: oklch(0.56 0.25 296.2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">${t('resetButton')}</a>
            <p>${t('emailDisclaimer', { brand: BRAND.name })}</p>
            <p>${t('emailExpiry')}</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
            <p style="color: #666; font-size: 12px;">${t('emailFooter')}</p>
          </div>
        `,
      });

      return info;
    } catch (error) {
      throw error;
    }
  }
}

export const emailService = new EmailService();
