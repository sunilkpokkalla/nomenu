import Link from "next/link";
import { ArrowLeft, Sparkles, DollarSign, TrendingUp, Link as LinkIcon, CheckCircle2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PartnersLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans-vibrant">
      {/* FLOATING HEADER */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 transition-all duration-500">
        <div className="w-full rounded-full border border-slate-200/50 bg-white/70 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-sm">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white">
              <QrCode className="h-4 w-4" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-950">
              NoMenu <span className="text-amber-500 font-bold">Partners</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-wider text-slate-500">
              <Link href="/partners/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="font-bold text-xs uppercase tracking-wider bg-slate-950 hover:bg-slate-900 text-white rounded-full px-5 py-4">
              <Link href="/partners/signup">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e293b,transparent_75%)] opacity-50 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider mb-8">
            <Sparkles className="h-3.5 w-3.5" /> Influencer & Agency Program
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl mx-auto">
            Turn your restaurant audience into <span className="text-amber-500 italic font-serif">recurring revenue.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Recommend the world's most beautiful restaurant operating system and earn lucrative cash payouts for every restaurant that upgrades using your tracking link.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-8 py-6 text-base shadow-xl shadow-amber-500/20">
              <Link href="/partners/signup">Apply Now (Free)</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl mb-16">How it works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 border border-indigo-100">
                <LinkIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1. Apply & Get Approved</h3>
              <p className="text-slate-500 font-medium">Apply to join the program and create your custom tracking code (e.g., FOODIE50). Our team will review your application within 24-48 hours.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2. Share & Offer a 15% Discount</h3>
              <p className="text-slate-500 font-medium">Share your link with your audience. When they upgrade to an annual plan using your code, they get an exclusive <span className="font-bold text-emerald-600">15% discount</span> (standard users only get 10%).</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 border border-amber-100">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">3. Earn Cash</h3>
              <p className="text-slate-500 font-medium">When a restaurant upgrades to a paid annual plan, you earn up to $100 in cash. Track everything in your live dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PAYOUT TIERS */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">Lucrative Payout Tiers</h2>
            <p className="mt-4 text-slate-500 font-medium">Earn bounties based on the annual plan your referred restaurant chooses.</p>
            
            <div className="mt-8 max-w-2xl mx-auto bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-left">
              <h3 className="text-amber-600 font-black text-xl mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> The "Golden 1,000" Founding Tier
              </h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                The first 1,000 approved partners receive <strong className="text-amber-600 font-bold">Lifetime Recurring Revenue</strong> (paid annually) for every restaurant they refer. Partners #1,001 and beyond receive a standard one-time upfront bounty. Apply now to secure your lifetime spot.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2">Pro Plan</h3>
              <div className="text-4xl font-black text-slate-950 mb-4">$35</div>
              <p className="text-sm text-slate-500 font-medium">Earned per restaurant</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border-2 border-amber-400 text-center shadow-xl shadow-amber-500/5 relative scale-105">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2">Elite Plan</h3>
              <div className="text-5xl font-black text-slate-950 mb-4">$75</div>
              <p className="text-sm text-slate-500 font-medium">Earned per restaurant</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2">Enterprise Plan</h3>
              <div className="text-4xl font-black text-slate-950 mb-4">$100</div>
              <p className="text-sm text-slate-500 font-medium">Earned per restaurant</p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight mb-6">Real-time tracking and transparency.</h2>
            <p className="text-slate-400 text-lg mb-8">
              No guessing, no spreadsheets. The moment a restaurant clicks your link, you can track their journey. See when they sign up, see what plan they choose, and watch your pending cash payouts grow in real-time.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="h-5 w-5 text-amber-500" /> Track clicks and signups
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="h-5 w-5 text-amber-500" /> Watch pending cash payouts
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="h-5 w-5 text-amber-500" /> 30-day cookie window
              </li>
            </ul>
          </div>
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg">Partner Dashboard</h3>
              <div className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold">Live</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Clicks</p>
                <p className="text-2xl font-black">1,204</p>
              </div>
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Conversions</p>
                <p className="text-2xl font-black">42</p>
              </div>
            </div>
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center">
              <p className="text-slate-500 text-xs font-bold uppercase mb-2">Pending Cash Payout</p>
              <p className="text-5xl font-black text-amber-500">$3,150</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-amber-400 text-amber-950 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Ready to start earning?</h2>
          <Button asChild size="lg" className="rounded-full bg-slate-950 hover:bg-slate-900 text-white font-bold px-10 py-8 text-lg shadow-xl shadow-slate-950/20 hover:scale-105 transition-transform duration-300">
            <Link href="/partners/signup">Apply to Partner Program</Link>
          </Button>
          <p className="mt-6 text-amber-900/60 font-semibold">Takes 2 minutes to apply.</p>
        </div>
      </section>

    </div>
  );
}
