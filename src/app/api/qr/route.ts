import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data");
  if (!data) {
    return new NextResponse("Missing data parameter", { status: 400 });
  }

  // Use a high-quality 600x600 size for print readiness
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(data)}`;
  try {
    const res = await fetch(qrUrl);
    if (!res.ok) {
      return new NextResponse("Failed to fetch QR code from upstream", { status: res.status });
    }
    const blob = await res.blob();
    
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("QR Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
