import { Resend } from 'resend';
import { render } from '@react-email/components';
import { WelcomeEmail } from '@/emails/welcome-email';

interface SendWelcomeEmailParams {
  userName: string;
  userEmail: string;
  resendApiKey: string;
}

export async function sendWelcomeEmail({ userName, userEmail, resendApiKey }: SendWelcomeEmailParams) {
  try {
    // Initialize Resend with the provided API key
    const resend = new Resend(resendApiKey);

    // Render the email template
    const htmlContent = await render(
      WelcomeEmail({ userName })
    );

    // Send the email
    const result = await resend.emails.send({
      from: `welcome@${process.env.NEXT_PUBLIC_APP_DOMAIN || 'mantlz.app'}`,
      to: userEmail,
      subject: 'Welcome to Mantlz!',
      html: htmlContent,
    });

    return { sent: true, result };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { sent: false, error };
  }
} 