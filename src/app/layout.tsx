import type { Metadata } from "next";
import { Inter, Lora, Montserrat, Cormorant_Garamond, Poppins, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"], 
  variable: "--font-cormorant" 
});
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800"], 
  variable: "--font-poppins" 
});
const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"], 
  variable: "--font-outfit" 
});
const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "700"], 
  variable: "--font-space-mono" 
});

import { ClientErrorLogger } from "@/components/client-error-logger";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "NoMenu | Digital QR Menus for Restaurants",
    template: "%s | NoMenu"
  },
  description: "Create and manage beautiful digital QR code menus for your restaurant in minutes. Fast, contactless, and easy to update.",
  keywords: ["QR menu", "restaurant menu app", "digital menu", "contactless menu", "restaurant technology", "menu generator", "NoMenu"],
  authors: [{ name: "AmBrightTech LLC" }],
  creator: "AmBrightTech LLC",
  publisher: "AmBrightTech LLC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NoMenu",
    title: "NoMenu | Digital QR Menus for Restaurants",
    description: "Create and manage beautiful digital QR code menus for your restaurant in minutes. Fast, contactless, and easy to update.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NoMenu - Digital QR Menus for Restaurants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoMenu | Digital QR Menus for Restaurants",
    description: "Create and manage beautiful digital QR code menus for your restaurant in minutes. Fast, contactless, and easy to update.",
    images: ["/og-image.png"],
  },
};

import { SupabaseHashListener } from "@/components/supabase-hash-listener";
import { CSPostHogProvider } from "@/components/providers/posthog-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} ${montserrat.variable} ${cormorant.variable} ${poppins.variable} ${outfit.variable} ${spaceMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <SupabaseHashListener />
        <NextTopLoader
          color="#2563EB"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563EB,0 0 5px #2563EB"
        />
        <ClientErrorLogger />
        <CSPostHogProvider>
          {children}
        </CSPostHogProvider>
      </body>
    </html>
  );
}

