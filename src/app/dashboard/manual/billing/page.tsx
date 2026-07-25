import Link from "next/link";
import { ArrowLeft, CreditCard, Sparkles, Check, Zap } from "lucide-react";

export const metadata = {
  title: "Billing & Plans | NoMenu Manual",
  description: "Learn about NoMenu's subscription plans, features, and billing management.",
};

export default function BillingManualPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8 animate-in fade-in duration-500">
      
      {/* Back Button */}
      <Link 
        href="/dashboard/manual"
        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Manual
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-green-100 text-green-600 rounded-3xl">
          <CreditCard className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Billing & Plans</h1>
          <p className="text-lg text-slate-500 mt-2">
            Compare subscription tiers, manage your Stripe billing, and track AI credits.
          </p>
        </div>
      </div>

      <div className="space-y-12">

        {/* Section 1: The Plans */}
        <section className="scroll-mt-24" id="plans">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-900">Subscription Tiers</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Free Plan</h3>
              <p className="text-sm text-slate-600 mb-4 h-10">Perfect for small pop-ups and testing.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500"/> 1 Digital Menu (Up to 30 Items)</li>
                <li className="flex items-center gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500"/> Basic QR Code Builder</li>
                <li className="flex items-center gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500"/> 2 Essential Themes</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pro Plan</h3>
              <p className="text-sm text-slate-600 mb-4 h-10">Unlimited flexibility for high-volume venues.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500"/> Unlimited Menus, Items & QR Codes</li>
                <li className="flex items-center gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500"/> Digital Waitlist & FOH Ops</li>
                <li className="flex items-center gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500"/> 25 AI Credits/mo (Multi-Language)</li>
                <li className="flex items-center gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-500"/> Private Feedback System</li>
              </ul>
            </div>

            {/* Elite */}
            <div className="bg-slate-900 text-white border border-slate-800 shadow-xl p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-indigo-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">Recommended</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Elite Plan</h3>
              <p className="text-sm text-slate-300 mb-4 h-10">Real-time ordering for premium venues and groups.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-200"><Check className="w-4 h-4 text-emerald-400"/> Fully Integrated POS & Ordering</li>
                <li className="flex items-center gap-2 text-sm text-slate-200"><Check className="w-4 h-4 text-emerald-400"/> Active Tabs & Live KDS</li>
                <li className="flex items-center gap-2 text-sm text-slate-200"><Check className="w-4 h-4 text-emerald-400"/> 50 AI Credits/mo</li>
                <li className="flex items-center gap-2 text-sm text-slate-200"><Check className="w-4 h-4 text-emerald-400"/> All Premium Themes & White-labeling</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Enterprise Plan</h3>
              <p className="text-sm text-indigo-700/80 mb-4 h-10">Full commerce suite with direct payouts.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-indigo-900"><Check className="w-4 h-4 text-indigo-500"/> Dine-in, Takeaway & Priority Reserve</li>
                <li className="flex items-center gap-2 text-sm text-indigo-900"><Check className="w-4 h-4 text-indigo-500"/> Multiple Kitchen Displays (KDS)</li>
                <li className="flex items-center gap-2 text-sm text-indigo-900"><Check className="w-4 h-4 text-indigo-500"/> Intelligent Order Capacity Pacing</li>
                <li className="flex items-center gap-2 text-sm text-indigo-900"><Check className="w-4 h-4 text-indigo-500"/> White-Glove Setup & VIP Support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: AI Credits */}
        <section className="scroll-mt-24" id="ai-credits">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-900">Understanding Magic AI Credits</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600">
            <p>
              NoMenu uses <strong>Google Gemini AI</strong> to power several intelligent features across the platform. AI Credits are consumed when you use these features:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-6">
              <li><strong>AI Menu Translation:</strong> Translating your entire menu into multiple languages instantly.</li>
              <li><strong>AI Description Generation:</strong> Generating mouth-watering descriptions for your dishes based on ingredients.</li>
              <li><strong>Smart Service Recovery:</strong> Generating custom apology emails and offers for 1-star reviews.</li>
              <li><strong>Image Generation:</strong> Creating placeholder images for your menu items.</li>
            </ul>
            <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-sky-800 text-sm">
              <strong>Note:</strong> Your AI credits reset at the beginning of each billing cycle. If you run out, you can easily top up from the Billing dashboard.
            </div>
          </div>
        </section>

        {/* Section 3: Managing Billing */}
        <section className="scroll-mt-24" id="managing-billing">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-900">Managing Your Subscription</h2>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600">
            <p>
              To manage your billing, navigate to the <strong>Billing</strong> tab in your dashboard. From there, you can:
            </p>
            <ol className="list-decimal pl-5 space-y-3">
              <li><strong>Upgrade/Downgrade:</strong> Switch between monthly and annual billing, or move to a higher tier instantly. Stripe automatically prorates your payments.</li>
              <li><strong>Access Stripe Portal:</strong> Click <em>"Manage Billing in Stripe"</em> to update your credit card, download past invoices, and cancel your subscription.</li>
              <li><strong>Top-up Credits:</strong> Buy additional AI Magic Credits on demand.</li>
            </ol>
          </div>
        </section>
        
        {/* Next Steps */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center">
          <Link 
            href="/dashboard/manual/analytics"
            className="flex flex-col gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider">Previous</span>
            <span className="text-lg font-medium flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" /> Analytics & Payouts
            </span>
          </Link>
          <Link 
            href="/dashboard/manual/security"
            className="flex flex-col gap-1 text-right text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider">Next</span>
            <span className="text-lg font-medium flex items-center">
              Security & Team <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}
