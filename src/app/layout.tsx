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
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nomenu.us"),
  title: {
    default: "NoMenu | The All-in-One Restaurant Platform",
    template: "%s | NoMenu"
  },
  description: "Replace your clunky POS with NoMenu. Get unified QR code menus, Kitchen Display Systems (KDS), digital payments, and marketing automation in one seamless platform.",
  keywords: ["restaurant pos", "kitchen display system", "kds", "digital menu", "qr code ordering", "restaurant platform", "restaurant marketing", "NoMenu"],
  authors: [{ name: "AmBrightTech LLC" }],
  creator: "AmBrightTech LLC",
  publisher: "AmBrightTech LLC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NoMenu",
    title: "NoMenu | The All-in-One Restaurant Platform",
    description: "Replace your clunky POS with NoMenu. Get unified QR code menus, Kitchen Display Systems (KDS), digital payments, and marketing automation in one seamless platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NoMenu - The All-in-One Restaurant Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoMenu | The All-in-One Restaurant Platform",
    description: "Replace your clunky POS with NoMenu. Get unified QR code menus, Kitchen Display Systems (KDS), digital payments, and marketing automation in one seamless platform.",
    creator: "@nomenu",
    images: ["/og-image.png"],
  },
};

import { SupabaseHashListener } from "@/components/supabase-hash-listener";

import { ReferralTracker } from "@/components/referral-tracker";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="facebook-domain-verification" content="45r5jqh39mijnq5mdeh3a5wp5dktet" />
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src='https://connect.facebook.net/en_US/fbevents.js';
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script');
              fbq('init', '2198654707623743');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${lora.variable} ${montserrat.variable} ${cormorant.variable} ${poppins.variable} ${outfit.variable} ${spaceMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=2198654707623743&ev=PageView&noscript=1" alt="" />
        </noscript>
        <SupabaseHashListener />
        <ReferralTracker />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "NoMenu",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Replace your clunky POS with NoMenu. Get unified QR code menus, Kitchen Display Systems (KDS), digital payments, and marketing automation in one seamless platform.",
              "url": "https://nomenu.us",
              "publisher": {
                "@type": "Organization",
                "name": "AmBrightTech LLC"
              }
            })
          }}
        />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

