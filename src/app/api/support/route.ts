import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { subject, urgency, message, userEmail, restaurantName, contactNumber } = body;

    if (!subject || !message || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Configure Nodemailer with Zoho SMTP
    // The user needs to set these in their .env.local / Vercel
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 4. Construct Email
    const mailOptions = {
      from: `"${restaurantName} (via NoMenu Support)" <${process.env.SMTP_USER || "noreply@nomenu.us"}>`,
      to: "support@nomenu.us",
      replyTo: userEmail,
      subject: `[${urgency.toUpperCase()}] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Support Ticket</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 120px;"><strong>Restaurant:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${restaurantName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>User Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><a href="mailto:${userEmail}">${userEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Contact Number:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${contactNumber || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Urgency:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="background-color: ${urgency === 'Critical' ? '#fee2e2' : urgency === 'High' ? '#ffedd5' : '#f1f5f9'}; color: ${urgency === 'Critical' ? '#991b1b' : urgency === 'High' ? '#9a3412' : '#334155'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                  ${urgency}
                </span>
              </td>
            </tr>
          </table>
          <h3 style="color: #0f172a; margin-bottom: 8px;">Message:</h3>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; color: #334155; white-space: pre-wrap; line-height: 1.6;">${message}</div>
        </div>
      `,
    };

    // 5. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please check SMTP configuration." },
      { status: 500 }
    );
  }
}
