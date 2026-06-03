import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6 shadow-inner">
          <SearchX className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Page not found</h1>
        
        <p className="text-slate-500 text-lg leading-relaxed">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-white text-slate-700 font-bold px-8 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm active:scale-[0.98]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
