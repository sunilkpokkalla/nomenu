import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
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

    // Generate a unique ticket number (e.g., NM260724-X7B9Q2)
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticketNumber = `NM${dateStr}-${randomStr}`;

    // 3. Send Email to Support Team
    const supportMailOptions = {
      to: "support@nomenu.us",
      replyTo: userEmail,
      subject: `[${urgency.toUpperCase()}] ${subject} (#${ticketNumber})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Support Ticket: #${ticketNumber}</h2>
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
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; color: #334155; line-height: 1.6; white-space: pre-wrap;">
            ${message}
          </div>
          <div style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
            <p>This email was sent from the NoMenu dashboard support form.</p>
          </div>
        </div>
      `,
    };

    // 4. Send Confirmation Email to the User
    const userMailOptions = {
      to: userEmail,
      subject: `Support Ticket Received: #${ticketNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-top: 0;">We've received your request!</h2>
          <p style="color: #475569; line-height: 1.6;">Hi there,</p>
          <p style="color: #475569; line-height: 1.6;">Thank you for contacting NoMenu Support. We have received your ticket (<strong>#${ticketNumber}</strong>) and our team is looking into it.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h4 style="margin-top: 0; color: #0f172a; margin-bottom: 12px;">Your Request Details:</h4>
            <p style="color: #475569; margin: 0 0 8px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #475569; margin: 0;"><strong>Urgency:</strong> ${urgency}</p>
          </div>

          <p style="color: #475569; line-height: 1.6;">We typically respond within 24 hours. If you have any additional information to add, simply reply to this email.</p>
          
          <br/>
          <p style="color: #475569; line-height: 1.6; margin-bottom: 0;">Best regards,</p>
          <p style="color: #0f172a; font-weight: bold; margin-top: 4px;">The NoMenu Team</p>
        </div>
      `,
    };

    // Send both emails simultaneously
    const [supportResult, userResult] = await Promise.all([
      sendEmail(supportMailOptions),
      sendEmail(userMailOptions)
    ]);

    if (!supportResult.success || !userResult.success) {
      console.error("Failed to send support emails", { support: supportResult.error, user: userResult.error });
      return NextResponse.json({ error: supportResult.error || userResult.error || "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Support ticket submitted successfully." });

  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please check SMTP configuration." },
      { status: 500 }
    );
  }
}
