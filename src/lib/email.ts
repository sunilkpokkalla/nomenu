import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'NoMenu <noreply@nomenu.us>',
      to,
      subject,
      html,
      replyTo: replyTo,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Internal error sending email" };
  }
}
