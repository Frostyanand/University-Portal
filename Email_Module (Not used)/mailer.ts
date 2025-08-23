// mailer.ts
import nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';
import type { Attachment } from './utils';
import dotenv from 'dotenv';

dotenv.config();

// -- SMTP Configuration from .env --
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,            // e.g., smtp.gmail.com or smtp.zoho.in
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,         // faculty@college.edu
    pass: process.env.SMTP_PASS          // app password or SMTP token
  }
});

// -- Mailer function --
export interface EmailOptions {
  from: string;                         // sender
  to: string | string[];               // single or batch recipients
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;                        // HTML content (use templateEngine to create this)
  attachments?: Attachment[];          // optional
}

export async function sendEmail(options: EmailOptions): Promise<SentMessageInfo> {
  if (!options.from) {
    throw new Error('Sender email (from) is required');
  }

  if (!options.to) {
    throw new Error('Recipient email (to) is required');
  }

  try {
    const mailOptions = {
      from: options.from,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(' Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error(' Email failed:', error);
    throw error;
  }
}

/**
 * Retry wrapper around sendEmail
 */
export async function retrySendEmail(
  options: EmailOptions,
  retries: number = 3,
  delayMs: number = 2000
): Promise<SentMessageInfo> {
  let attempt = 0;
  let lastError: any;

  while (attempt < retries) {
    try {
      return await sendEmail(options);
    } catch (error: any) {
      lastError = error;
      attempt++;

      const isRetryable = error?.code === 'ECONNREFUSED' || error?.code === 'ETIMEDOUT';

      console.warn(`Attempt ${attempt} failed: ${error.message}`);

      if (!isRetryable || attempt >= retries) {
        break;
      }

      await new Promise((res) => setTimeout(res, delayMs * attempt)); // Exponential backoff
    }
  }

  throw lastError;
}
