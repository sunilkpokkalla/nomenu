import Link from "next/link";
import { ArrowLeft, QrCode, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "QR Codes - Manual | NoMenu",
};

export default function QRCodesManualPage() {
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
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Generating QR Codes</h1>
        <p className="text-xl text-slate-500">
          Generate, download, and manage QR codes for your tables to allow instant ordering.
        </p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm">In this guide</h3>
        <ul className="space-y-3">
          <li><a href="#location-zones" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">1. Creating Location Zones</a></li>
          <li><a href="#generating" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">2. Generating Table QR Codes</a></li>
          <li><a href="#designer" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">3. Using the QR Designer</a></li>
        </ul>
      </div>

      <div className="space-y-16">
        
        <section id="location-zones" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Creating Location Zones
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Before generating QR codes, you should set up Location Zones. This helps you organize where orders are coming from (e.g., "Patio", "Main Dining", "Bar").
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ol className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Navigate to the <strong>QR Codes</strong> tab.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Click the <strong>Manage Zones</strong> button at the top.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Add your zones. You can also specify if a zone carries an additional service fee.</span>
              </li>
            </ol>
          </div>
        </section>

        <section id="generating" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Generating Table QR Codes
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Once zones are set up, you can generate the actual QR codes that will be placed on tables.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-4">
            <h4 className="font-bold text-slate-900 mb-2">How it works:</h4>
            <p className="text-slate-600 mb-4">Click "Create QR Code". Enter a label (like "Table 1" or "Bar Seat 4") and assign it to a zone. When a customer scans this specific QR code, their order will automatically be tagged with "Table 1 (Patio)" so your staff knows exactly where to bring the food.</p>
            
            <h4 className="font-bold text-slate-900 mt-6 mb-2">Bulk Generation & Plan Limits</h4>
            <p className="text-slate-600 mb-2">
              If you have a large restaurant, creating QR codes one-by-one is tedious. You can use the <strong>Bulk Create</strong> feature to generate up to 100 QR codes instantly. These are rendered directly in your browser for maximum speed and stability.
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li><strong>Free Plan:</strong> Limited to 1 active QR Code.</li>
              <li><strong>Pro, Elite & Enterprise Plans:</strong> Unlimited QR Codes.</li>
            </ul>
          </div>
        </section>

        <section id="designer" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Using the QR Designer
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Don't settle for boring black-and-white QR codes. Use the built-in designer to make them match your brand!
          </p>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
              <span className="font-bold text-lg text-slate-900">1. Open the Designer</span>
              <span className="text-slate-500 text-sm">Click the "Paint Palette" icon next to any QR code.</span>
            </li>
            <li className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
              <span className="font-bold text-lg text-slate-900">2. Change Colors</span>
              <span className="text-slate-500 text-sm">Adjust the foreground (dots) and background colors. Make sure there is high contrast so phone cameras can easily read it!</span>
            </li>
            <li className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
              <span className="font-bold text-lg text-slate-900">3. Add a Center Logo</span>
              <span className="text-slate-500 text-sm">Upload a small square version of your logo to place it perfectly in the center of the QR code.</span>
            </li>
            <li className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
              <span className="font-bold text-lg text-slate-900">4. Export SVG</span>
              <span className="text-slate-500 text-sm">Always export as SVG if you are sending the file to a professional print shop (like for table tents or stickers). SVGs can be scaled infinitely without losing quality.</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
