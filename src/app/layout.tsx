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
  title: {
    default: "NoMenu | Digital QR Menus for Restaurants",
    template: "%s | NoMenu"
  },
  description: "Create and manage beautiful digital QR code menus for your restaurant in minutes. Fast, contactless, and easy to update.",
  keywords: ["QR menu", "restaurant menu app", "digital menu", "contactless menu", "restaurant technology", "menu generator", "NoMenu"],
  authors: [{ name: "AmBrightTech LLC" }],
  creator: "AmBrightTech LLC",
  publisher: "AmBrightTech LLC",
};

import { SupabaseHashListener } from "@/components/supabase-hash-listener";

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
        {children}
      </body>
    </html>
  );
}

