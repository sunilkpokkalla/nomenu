import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signupAffiliate } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function PartnersSignupPage(
  props: {
    searchParams: Promise<{ message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <main className="flex min-h-screen bg-slate-50 font-sans-vibrant">
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        
        {/* Back Button */}
        <Link href="/partners" className="absolute top-6 left-6 text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold transition-colors z-20">
          <ArrowLeft className="w-4 h-4" />
          Back to Partners Program
        </Link>

        <div className="w-full max-w-[420px] space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
          
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">Become a Partner</h2>
            <p className="text-slate-500 font-medium text-sm">
              Create your affiliate account to generate your tracking link.
            </p>
          </div>

          {searchParams.message && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 text-left">
              {searchParams.message}
            </div>
          )}

          <form action={signupAffiliate} className="space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Jane Doe"
                className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Account Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                minLength={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypalEmail" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Payout Email (For Rewards)</Label>
              <Input
                id="paypalEmail"
                name="paypalEmail"
                type="email"
                placeholder="jane@email.com"
                className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Label htmlFor="referralCode" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Create Custom Promo Code</Label>
              <p className="text-[11px] text-slate-500 mb-2">This is the code you will share (e.g. FOODIE50).</p>
              <Input
                id="referralCode"
                name="referralCode"
                placeholder="ATLANTAEATS"
                className="h-12 bg-amber-50/50 border-amber-200 text-amber-900 font-mono font-bold uppercase rounded-xl px-4 shadow-sm focus-visible:ring-amber-500"
                required
              />
            </div>

            <Button type="submit" className="w-full h-14 bg-slate-950 hover:bg-slate-900 text-white font-bold text-base mt-4 rounded-xl transition-all shadow-md">
              Create Partner Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 font-medium">
            Already a partner?{" "}
            <Link href="/partners/login" className="text-primary hover:underline font-bold">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
