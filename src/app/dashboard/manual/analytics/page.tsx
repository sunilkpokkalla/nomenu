import Link from "next/link";
import { ArrowLeft, LineChart, TrendingUp, Banknote, Calendar } from "lucide-react";

export const metadata = {
  title: "Analytics - Manual | NoMenu",
};

export default function AnalyticsManualPage() {
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
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
          <LineChart className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics & Payouts</h1>
        <p className="text-xl text-slate-500">
          Understand your sales data, read the performance charts, and track your Stripe payouts.
        </p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm">In this guide</h3>
        <ul className="space-y-3">
          <li><a href="#sales-dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">1. Using the Sales Dashboard</a></li>
          <li><a href="#date-ranges" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">2. Selecting Date Ranges</a></li>
          <li><a href="#payouts" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">3. Tracking Stripe Payouts</a></li>
        </ul>
      </div>

      <div className="space-y-16">
        
        <section id="sales-dashboard" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Using the Sales Dashboard
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            The Analytics tab provides a high-level overview of how your restaurant is performing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0"><Banknote className="w-6 h-6"/></div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Gross Revenue</h4>
                <p className="text-slate-600 text-sm">Total sales across all completed orders in the selected time period.</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0"><TrendingUp className="w-6 h-6"/></div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Top Selling Items</h4>
                <p className="text-slate-600 text-sm">A list of your most popular dishes, ranked by quantity sold. Use this to optimize your menu!</p>
              </div>
            </div>
          </div>
        </section>

        <section id="date-ranges" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Selecting Date Ranges
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            By default, the analytics dashboard shows you data from the <strong>Last 7 Days</strong>.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-4">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              The Date Picker
            </h4>
            <p className="text-slate-600 mb-4">Click the Date Picker button at the top right of the Analytics page to change the range. You can select:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 ml-2">
              <li>Today</li>
              <li>Yesterday</li>
              <li>Last 7 Days</li>
              <li>Last 30 Days</li>
              <li>This Month</li>
              <li>Or click two dates on the calendar to set a completely custom range.</li>
            </ul>
            <p className="text-slate-500 text-sm mt-4 italic">*The charts and statistics will instantly recalculate based on the dates you choose.*</p>
          </div>
        </section>

        <section id="payouts" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Tracking Stripe Payouts
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            While Analytics shows you what you sold, the <strong>Payouts</strong> tab shows you when that money actually hits your bank account.
          </p>
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
            <h4 className="font-bold text-indigo-900 mb-3">How Payouts Work:</h4>
            <p className="text-indigo-800 mb-4 leading-relaxed">
              When a customer pays via credit card, the funds are held by Stripe. Stripe groups these payments and transfers them to your connected bank account automatically (usually on a 2-day rolling basis).
            </p>
            <p className="text-indigo-800 leading-relaxed">
              Navigate to the <strong>Payouts</strong> tab in the sidebar to see a list of all historical payouts, their exact dollar amount, and the date they landed in your bank. If a payout says "In Transit", it means the money has left Stripe and is currently being processed by your bank.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
