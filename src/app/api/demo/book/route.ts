import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, date, time } = await req.json();

    if (!email || !email.includes("@") || !date || !time) {
      return NextResponse.json({ success: false, error: "Invalid booking details" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    // 1. Insert into nomi_leads
    const { error: dbError } = await supabase
      .from("nomi_leads")
      .insert([{ email }])
      .select();

    if (dbError && dbError.code !== "23505") { // Ignore duplicate email error
      console.error("Database lead insert error:", dbError);
    }

    // 2. Send email to admin
    const recipients = ["support@nomenu.us", "skpokkalla@gmail.com"];
    await sendEmail({
      to: recipients,
      subject: `📅 New Demo Booking: ${email}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0c2340;">
          <h2>New 1-on-1 Demo Booked</h2>
          <p>A visitor has scheduled a 30-minute walkthrough of NoMenu.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Customer Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time Slot:</strong> ${time}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p>You can reply directly to this email or send them a Google Meet/Zoom link to confirm.</p>
        </div>
      `,
      replyTo: email,
    });

    // 3. Send confirmation email to customer
    await sendEmail({
      to: email,
      subject: "Your NoMenu 1-on-1 Demo is Scheduled!",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0c2340; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">Demo Scheduled Successfully!</h2>
          <p>Hi there,</p>
          <p>Thank you for scheduling a 30-minute walkthrough of NoMenu. Here are your booking details:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #f1f5f9;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> 30 minutes</p>
          </div>
          <p>A product expert will reach out to you at this email address with a Google Meet invitation shortly.</p>
          <p>If you need to reschedule or have any questions beforehand, please reply to this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">NoMenu Support Team | noreply@nomenu.us</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to book demo" },
      { status: 500 }
    );
  }
}
