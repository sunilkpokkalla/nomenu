import Link from "next/link";
import { ArrowLeft, BookOpen, Star, MessageSquare, Bot, Download } from "lucide-react";

export const metadata = {
  title: "Customer Feedback & AI - Manual | NoMenu",
};

export default function FeedbackManualPage() {
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
        <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Customer Feedback & AI</h1>
        <p className="text-xl text-slate-500">
          Manage your real-time customer feedback, configure the Gemini AI service recovery strategies, and export your customer data.
        </p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm">In this guide</h3>
        <ul className="space-y-3">
          <li><a href="#viewing-feedback" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">1. Viewing & Filtering Feedback</a></li>
          <li><a href="#service-recovery" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">2. AI Service Recovery Strategy</a></li>
          <li><a href="#csv-export" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">3. Exporting Customer Data</a></li>
        </ul>
      </div>

      <div className="space-y-16">
        
        <section id="viewing-feedback" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Viewing & Filtering Feedback
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            When a customer submits feedback from their digital menu, it immediately appears in your <strong>Customer Feedback</strong> tab.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0"><Star className="w-6 h-6"/></div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Ratings Filter</h4>
                <p className="text-slate-600 text-sm">Use the dropdown to filter by Positive (4-5 stars), Neutral (3 stars), or Needs Attention (1-2 stars).</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0"><MessageSquare className="w-6 h-6"/></div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Deep Search</h4>
                <p className="text-slate-600 text-sm">Search across customer names, emails, table numbers, or specific words used in their comment.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="service-recovery" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            AI Service Recovery Strategy
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            NoMenu includes a powerful Service Recovery system. If a customer is about to submit a 1, 2, or 3-star review, NoMenu intercepts them before they leave the restaurant.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-4">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              Configuring Your Strategy
            </h4>
            <p className="text-slate-600 mb-4">Under the <strong>Strategy Settings</strong> tab, you define how to handle unhappy customers. You can use preset templates, or have Google Gemini AI generate them for you.</p>
            <ul className="list-disc list-inside space-y-3 text-slate-600 ml-2">
              <li><strong>The Offer:</strong> What are you willing to give the customer to make it right? (e.g., "15% off your next visit", "A complimentary dessert"). Use the presets dropdown for quick, battle-tested offers.</li>
              <li><strong>The Message:</strong> The customized apology text shown to the customer. Click "✨ Generate with AI" to instantly write a professional, empathetic apology based on your offer.</li>
            </ul>
          </div>
        </section>

        <section id="csv-export" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Exporting Customer Data
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            You own your customer data. You can export it at any time to build email marketing lists or analyze long-term trends.
          </p>
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
            <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <Download className="w-5 h-5" />
              How Exporting Works:
            </h4>
            <p className="text-emerald-800 mb-4 leading-relaxed">
              Click the <strong>Export</strong> button in the top right corner of the Customer Feedback table.
            </p>
            <p className="text-emerald-800 leading-relaxed">
              The export respects your current filters. If you search for "john@example.com" and click Export, your CSV will only contain his reviews. The downloaded file includes Date, Time, Customer Name, Contact Info (Email/Phone), Table Location, Rating, Sentiment, and the full Comment text.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
