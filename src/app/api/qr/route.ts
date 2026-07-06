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

    console.log("QR API called with colorParam:", colorParam);

    // Default to slate-900 if no color is provided or if it's invalid
    const darkColor = colorParam && /^#([0-9A-F]{3}){1,2}$/i.test(colorParam) 
      ? colorParam 
      : "#0F172A";

    // Generate QR code as an SVG string (Zero native dependencies, edge-safe)
    const svgString = await QRCode.toString(data, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 1,
      width: 500,
      color: {
        dark: darkColor,
        light: "#FFFFFF",
      },
    });

    return new NextResponse(svgString, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
