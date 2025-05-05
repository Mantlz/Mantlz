'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, from, replyTo }: EmailOptions) {
  try {
    const defaultFrom = process.env.DEFAULT_FROM_EMAIL || 'noreply@mantlz.app';
    
    await resend.emails.send({
      from: from || defaultFrom,
      to,
      subject,
      html,
      replyTo
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
} 