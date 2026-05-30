import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get("data");

    if (!data) {
      return new NextResponse("Missing data parameter", { status: 400 });
    }

    // Generate QR code as a buffer
    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 500,
      color: {
        dark: "#0F172A", // slate-900
        light: "#FFFFFF",
      },
    });

    return new NextResponse(buffer, {
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
