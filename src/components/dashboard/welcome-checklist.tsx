import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Sparkles, Utensils, QrCode } from "lucide-react";

interface WelcomeChecklistProps {
  menusCount: number;
  itemsCount: number;
  qrCodesCount: number;
}

export function WelcomeChecklist({ menusCount, itemsCount, qrCodesCount }: WelcomeChecklistProps) {
  const hasMenu = menusCount > 0;
  const hasItems = itemsCount > 0;
  const hasQrCode = qrCodesCount > 0;

  // If all are completed, don't render the banner
  if (hasMenu && hasItems && hasQrCode) {
    return null;
  }

  const progress = [true, hasMenu, hasItems, hasQrCode].filter(Boolean).length;
  const total = 4;
  const percentage = (progress / total) * 100;

  return (
    <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm relative">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
      
      <div className="p-6 md:p-8 lg:px-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wide mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome to Nomenu
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Let's get your digital menu live.</h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
              Complete these quick steps to fully configure your restaurant and start tracking scans.
            </p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-sm font-bold text-slate-900 mb-2">{progress} of {total} Complete</span>
            <div className="w-full md:w-48 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1: Profile (Always Done) */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 opacity-70">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm line-through">Create Profile</p>
              <p className="text-xs text-slate-500 mt-1">Restaurant details saved.</p>
            </div>
          </div>

          {/* Step 2: Create Menu */}
          <div className={`flex flex-col gap-3 rounded-2xl border p-5 transition-all ${hasMenu ? 'border-slate-100 bg-slate-50/50 opacity-70' : 'border-primary/30 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.05)]'}`}>
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${hasMenu ? 'bg-primary/20 text-primary' : 'bg-primary text-white'}`}>
                {hasMenu ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold text-sm">2</span>}
              </div>
            </div>
            <div>
              <p className={`font-bold text-sm ${hasMenu ? 'text-slate-900 line-through' : 'text-slate-900'}`}>Create Digital Menu</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">Define your layout and categories.</p>
              {!hasMenu && (
                <Link href="/dashboard/menus" className="inline-flex items-center text-xs font-bold text-primary hover:underline">
                  Go to Menus <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              )}
            </div>
          </div>

          {/* Step 3: Add Items */}
          <div className={`flex flex-col gap-3 rounded-2xl border p-5 transition-all ${hasItems ? 'border-slate-100 bg-slate-50/50 opacity-70' : (!hasMenu ? 'border-slate-100 bg-slate-50/50 opacity-50 grayscale' : 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.05)]')}`}>
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${hasItems ? 'bg-primary/20 text-primary' : (!hasMenu ? 'bg-slate-200 text-slate-400' : 'bg-amber-500 text-white')}`}>
                {hasItems ? <CheckCircle2 className="h-5 w-5" /> : <Utensils className="h-4 w-4" />}
              </div>
            </div>
            <div>
              <p className={`font-bold text-sm ${hasItems ? 'text-slate-900 line-through' : 'text-slate-900'}`}>Add Menu Items</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">Add dishes, prices, and photos.</p>
              {!hasItems && hasMenu && (
                <Link href="/dashboard/items" className="inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline">
                  Add Items <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              )}
            </div>
          </div>

          {/* Step 4: Print QR */}
          <div className={`flex flex-col gap-3 rounded-2xl border p-5 transition-all ${hasQrCode ? 'border-slate-100 bg-slate-50/50 opacity-70' : (!hasItems ? 'border-slate-100 bg-slate-50/50 opacity-50 grayscale' : 'border-blue-500/30 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.05)]')}`}>
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${hasQrCode ? 'bg-primary/20 text-primary' : (!hasItems ? 'bg-slate-200 text-slate-400' : 'bg-blue-500 text-white')}`}>
                {hasQrCode ? <CheckCircle2 className="h-5 w-5" /> : <QrCode className="h-4 w-4" />}
              </div>
            </div>
            <div>
              <p className={`font-bold text-sm ${hasQrCode ? 'text-slate-900 line-through' : 'text-slate-900'}`}>Print QR Code</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">Download your table tents.</p>
              {!hasQrCode && hasItems && (
                <Link href="/dashboard/qrcodes" className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                  Get QR Code <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
