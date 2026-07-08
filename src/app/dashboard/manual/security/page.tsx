import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Users } from "lucide-react";

export const metadata = {
  title: "Security & Team - Manual | NoMenu",
};

export default function SecurityManualPage() {
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
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Security & Team Access</h1>
        <p className="text-xl text-slate-500">
          Learn how Role-Based Access Control (RBAC) secures your data across multiple restaurant locations.
        </p>
      </div>

      <div className="space-y-16">
        
        <section className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Role-Based Access Control (RBAC)
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            NoMenu uses enterprise-grade security to ensure your data is safe and strictly isolated. 
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">Strict Isolation</h4>
              <p className="text-slate-600">
                Cashiers and front-of-house staff are strictly locked to their assigned restaurant. Even if your brand has 5 locations, a cashier at Location A cannot view or modify menus, feedback, or orders for Location B.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">Owner Privileges</h4>
              <p className="text-slate-600">
                Only the Restaurant Owner has full access to the billing, payouts, analytics, and team management settings. Cashiers do not have access to these sensitive tabs.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
