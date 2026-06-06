import Link from "next/link";
import { ArrowLeft, MonitorPlay, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Live Orders KDS - Manual | NoMenu",
};

export default function OrdersManualPage() {
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
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
          <MonitorPlay className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Live Order KDS</h1>
        <p className="text-xl text-slate-500">
          Master the Kitchen Display System to track incoming orders, manage their status, and process instant refunds.
        </p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm">In this guide</h3>
        <ul className="space-y-3">
          <li><a href="#understanding-kds" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">1. Understanding the KDS Layout</a></li>
          <li><a href="#order-flow" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">2. The Order Flow (Drag & Drop)</a></li>
          <li><a href="#cancellations" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">3. Cancellations & Automatic Refunds</a></li>
        </ul>
      </div>

      <div className="space-y-16">
        
        <section id="understanding-kds" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Understanding the KDS Layout
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            The Kitchen Display System (KDS) is designed to run on a tablet or monitor in your kitchen or behind the bar. It automatically updates in real-time.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ul className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <strong>Fullscreen Mode:</strong> Click the "Enter Fullscreen" button in the top right. This hides browser menus and prevents accidental closes.
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <strong>Sound Alerts:</strong> When a new order arrives, the KDS will play an audio chime. Make sure your device volume is turned up!
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <strong>Real-Time Sync:</strong> You never need to refresh the page. Orders appear instantly as soon as a customer checks out.
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section id="order-flow" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            The Order Flow (Drag & Drop)
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            The board is split into four main columns representing the lifecycle of an order.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-white border-t-4 border-blue-500 border-x border-b border-slate-200 p-6 rounded-xl">
              <h4 className="font-bold text-slate-900 mb-1">New Orders</h4>
              <p className="text-slate-500 text-sm">Fresh orders appear here automatically. They flash to grab your attention.</p>
            </div>
            <div className="bg-white border-t-4 border-amber-500 border-x border-b border-slate-200 p-6 rounded-xl">
              <h4 className="font-bold text-slate-900 mb-1">Preparing</h4>
              <p className="text-slate-500 text-sm">Drag an order here when the kitchen starts cooking.</p>
            </div>
            <div className="bg-white border-t-4 border-emerald-500 border-x border-b border-slate-200 p-6 rounded-xl">
              <h4 className="font-bold text-slate-900 mb-1">Ready</h4>
              <p className="text-slate-500 text-sm">Drag here when the food is plated and ready to be run to the table.</p>
            </div>
            <div className="bg-white border-t-4 border-slate-400 border-x border-b border-slate-200 p-6 rounded-xl">
              <h4 className="font-bold text-slate-900 mb-1">Served</h4>
              <p className="text-slate-500 text-sm">Drag here when the customer receives the food. Orders here auto-archive after 30 minutes.</p>
            </div>
          </div>
        </section>

        <section id="cancellations" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Cancellations & Automatic Refunds
          </h2>
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-rose-900 text-lg mb-2">How to Cancel an Order</h4>
              <p className="text-rose-800 mb-4 leading-relaxed">
                If you run out of an ingredient or need to reject an order, drag the order card to the far-right <strong>"Cancelled"</strong> column.
              </p>
              <ul className="list-disc list-inside space-y-2 text-rose-800">
                <li>A modal will immediately pop up asking you to confirm the cancellation.</li>
                <li><strong>CRITICAL:</strong> If the customer paid online via credit card (Stripe), confirming the cancellation will <strong>automatically trigger a full refund</strong> to their card. You do not need to log into Stripe manually.</li>
                <li>If the customer chose "Pay with Cash", it will just cancel the order without firing a refund.</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
