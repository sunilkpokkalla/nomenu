import Link from "next/link";
import { LucideIcon, ShieldAlert } from "lucide-react";

interface FeatureLockoutProps {
  featureName: string;
  requiredPlan: "Pro" | "Elite" | "Enterprise";
  description: string;
  icon: LucideIcon;
}

export function FeatureLockout({ featureName, requiredPlan, description, icon: Icon }: FeatureLockoutProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{featureName}</h1>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm max-w-2xl mx-auto mt-12 w-full">
        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
          <Icon className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Upgrade to {requiredPlan}</h2>
        <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed max-w-md mx-auto">
          {description}
        </p>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Your 24-Hour All-Access Pass has expired. To keep using this premium feature and optimize your restaurant operations, upgrade your plan.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:scale-[1.02] transition-all"
        >
          Unlock with {requiredPlan}
        </Link>
      </div>
    </div>
  );
}
