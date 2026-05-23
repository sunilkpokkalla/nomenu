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

export const metadata: Metadata = {
  title: "NoMenu",
  description: "Digital menu QR generator for restaurants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} ${montserrat.variable} ${cormorant.variable} ${poppins.variable} ${outfit.variable} ${spaceMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

