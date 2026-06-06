import Link from "next/link";
import { ArrowLeft, Palette, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Brand Customization - Manual | NoMenu",
};

export default function CustomizeManualPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      <Link 
        href="/dashboard/manual"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Documentation Index
      </Link>

      <div className="flex flex-col gap-4 pb-8 border-b border-slate-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
          <Palette className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Brand Customization</h1>
        <p className="text-xl text-slate-500">
          Make your digital menu look like your physical restaurant with custom logos, colors, and fonts.
        </p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm">In this guide</h3>
        <ul className="space-y-3">
          <li><a href="#logo-banner" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">1. Uploading Logo & Banner</a></li>
          <li><a href="#color-theme" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">2. Setting a Color Theme</a></li>
          <li><a href="#typography" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">3. Choosing Typography</a></li>
        </ul>
      </div>

      <div className="space-y-16">
        
        <section id="logo-banner" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Uploading Logo & Banner
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Your logo is the first thing customers see when they scan your QR code. Your banner sets the mood.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ol className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Navigate to the <strong>Customize</strong> tab.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Click the upload box for the <strong>Logo</strong>. For best results, use a transparent PNG.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Click the upload box for the <strong>Banner</strong>. We recommend a high-quality landscape image (e.g., a photo of your restaurant interior or your signature dish).</span>
              </li>
            </ol>
          </div>
        </section>

        <section id="color-theme" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Setting a Color Theme
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            NoMenu uses an advanced CSS variable system to instantly update the entire UI based on your brand color.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-2">Preset Themes</h4>
              <p className="text-slate-600">We have curated several beautiful preset themes (like Midnight, Ocean, Rose, and Forest). Click on any preset to instantly preview it.</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-2">Custom Hex Code</h4>
              <p className="text-slate-600">If your restaurant has a strict brand guideline, click the color picker box and enter your exact HEX code. NoMenu will automatically calculate shades and text-contrasts.</p>
            </div>
          </div>
        </section>

        <section id="typography" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Choosing Typography
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Fonts drastically change the feel of your menu. A fine-dining restaurant needs a different font than a casual sports bar.
          </p>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
              <span className="font-sans font-bold text-lg text-slate-900">Inter / Sans-Serif</span>
              <span className="text-slate-500 text-sm">Best for: Fast casual, modern cafes, clean and minimal designs.</span>
            </li>
            <li className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
              <span className="font-serif font-bold text-lg text-slate-900">Playfair / Serif</span>
              <span className="text-slate-500 text-sm">Best for: Fine dining, wine bars, elegant and traditional establishments.</span>
            </li>
            <li className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
              <span className="font-mono font-bold text-lg text-slate-900">Space Mono</span>
              <span className="text-slate-500 text-sm">Best for: Trendy pop-ups, modern technical aesthetics.</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
