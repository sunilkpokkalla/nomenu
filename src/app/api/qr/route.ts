import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get("data");
    const colorParam = searchParams.get("color");

    if (!data) {
      return new NextResponse("Missing data parameter", { status: 400 });
    }

    // Default to slate-900 if no color is provided or if it's invalid
    const darkColor = colorParam && /^#([0-9A-F]{3}){1,2}$/i.test(colorParam) 
      ? colorParam 
      : "#0F172A";

    // Generate QR code as a buffer
    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 500,
      color: {
        dark: darkColor,
        light: "#FFFFFF",
      },
    });

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
