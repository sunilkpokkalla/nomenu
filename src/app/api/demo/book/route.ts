import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, restaurant_name, email, phone, date, time } = await req.json();

    if (!email || !email.includes("@") || !date || !time) {
      return NextResponse.json({ success: false, error: "Invalid booking details" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!
    );

    // 1. Insert into nomi_leads with metadata
    const leadPayload: Record<string, string> = { email };
    if (name) leadPayload.name = name;
    if (restaurant_name) leadPayload.restaurant_name = restaurant_name;
    if (phone) leadPayload.phone = phone;
    if (date && time) leadPayload.demo_time = `${date} at ${time}`;

    const { error: dbError } = await supabase
      .from("nomi_leads")
      .upsert([leadPayload], { onConflict: "email" })
      .select();

    if (dbError) {
      console.error("Database lead insert/update error:", dbError);
    }

    // 2. Send detailed email to admin
    const recipients = ["support@nomenu.us", "skpokkalla@gmail.com"];
    const leadDisplayName = name || email;
    const leadRestaurant = restaurant_name ? ` (${restaurant_name})` : "";

    await sendEmail({
      to: recipients,
      subject: `📅 Demo Booked: ${leadDisplayName}${leadRestaurant}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #0c2340; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-top: 0;">New 1-on-1 Demo Scheduled!</h2>
          <p style="font-size: 14px; color: #475569;">A prospective restaurant customer has scheduled a 30-minute product walkthrough.</p>
          
          <div style="background-color: #f8fafc; padding: 18px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; font-size: 15px; color: #1e293b;">Lead Information</h3>
            <p style="margin: 6px 0;"><strong>Name:</strong> ${name || "N/A"}</p>
            <p style="margin: 6px 0;"><strong>Restaurant / Business:</strong> ${restaurant_name || "N/A"}</p>
            <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 6px 0;"><strong>Phone:</strong> ${phone ? `<a href="tel:${phone}">${phone}</a>` : "Not provided"}</p>
          </div>

          <div style="background-color: #eef2ff; padding: 18px; border-radius: 12px; margin: 20px 0; border: 1px solid #c7d2fe;">
            <h3 style="margin-top: 0; font-size: 15px; color: #3730a3;">Booking Schedule</h3>
            <p style="margin: 6px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 6px 0;"><strong>Time Slot:</strong> ${time}</p>
            <p style="margin: 6px 0;"><strong>Duration:</strong> 30 Minutes</p>
          </div>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">Reply directly to this email or send them a Google Meet/Zoom calendar invitation to confirm.</p>
        </div>
      `,
      replyTo: email,
    });

    // 3. Send confirmation email to customer
    await sendEmail({
      to: email,
      subject: `Your NoMenu 1-on-1 Demo is Scheduled (${date})`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #0c2340; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-top: 0;">Demo Scheduled Successfully!</h2>
          <p>Hi ${name || "there"},</p>
          <p>Thank you for scheduling a 30-minute walkthrough of NoMenu${restaurant_name ? ` for <strong>${restaurant_name}</strong>` : ""}. Here are your confirmed booking details:</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #f1f5f9;">
            <p style="margin: 6px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 6px 0;"><strong>Time:</strong> ${time}</p>
            <p style="margin: 6px 0;"><strong>Duration:</strong> 30 minutes</p>
          </div>

          <p>A product expert will reach out to you at <strong>${email}</strong> with a calendar invite and video meet link shortly.</p>
          <p style="font-size: 13px; color: #64748b;">Need to reschedule or have a quick question? Reply directly to this email!</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">NoMenu Team | support@nomenu.us</p>
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
