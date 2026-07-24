import Link from "next/link";
import { ArrowLeft, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Book a Demo",
  description: "Schedule a personalized walkthrough of NoMenu to see how we can increase your restaurant's profits.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans-vibrant">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none -z-10" />
      <div className="absolute top-[20%] -left-48 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-4xl relative z-10 mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            See NoMenu in Action.
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Watch exactly how our platform eliminates wait lines and grows your revenue.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden z-10 relative flex flex-col">
        
        {/* Top Section: Video Player */}
        <div className="w-full bg-slate-950 aspect-video relative flex items-center justify-center">
          {/* Replace this div with your actual YouTube or Vimeo iframe */}
          <div className="text-center text-slate-400">
            <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-indigo-500 border-b-[12px] border-b-transparent ml-2" />
            </div>
            <p className="font-bold">On-Demand Demo Video</p>
            <p className="text-xs mt-2 opacity-70">Embed your YouTube/Vimeo link here.</p>
          </div>
        </div>

        {/* Bottom Section: Social Proof & Calendar */}
        <div className="w-full flex flex-col md:flex-row border-t border-slate-200/60">
          
          <div className="w-full md:w-1/2 p-10 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col justify-center">
             <h3 className="text-xl font-black text-slate-900 mb-6">What you'll see in the demo:</h3>
             <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">How guests scan, order, and pay in under 30 seconds.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Live synchronization between the FOH and Kitchen Display.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">How our 0% commission structure actually works.</span>
              </li>
            </ul>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-700 italic">"We switched from Toast to NoMenu and immediately saw our margins jump. Setup took 15 min."</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-3">— Happy Customer</p>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 mb-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Have Questions?</h3>
            <p className="text-slate-500 text-sm font-medium max-w-sm mb-8">
              Book a quick 10-minute chat with an expert to get custom pricing for your restaurant.
            </p>
            
            {/* Calendar Embed Placeholder */}
            <div className="w-full bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 min-h-[250px] shadow-inner">
              <p className="text-sm font-bold text-slate-600">Calendly Widget Embed Here</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
