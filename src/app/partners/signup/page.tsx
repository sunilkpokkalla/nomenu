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
    <main className="flex min-h-screen bg-slate-50 font-sans-vibrant relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-orange-500/10 blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-amber-300/10 blur-[120px]" />
      </div>
      
      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto z-10">
        
        {/* Back Button */}
        <Link href="/partners" className="absolute top-6 left-6 text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold transition-colors z-20 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200/60">
          <ArrowLeft className="w-4 h-4" />
          Back to Partners Program
        </Link>

        <div className="w-full max-w-4xl space-y-8 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white">
          
          <div className="space-y-2 text-center max-w-lg mx-auto">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">Become a Partner</h2>
            <p className="text-slate-500 font-medium text-sm">
              Create your affiliate account to generate your tracking link.
            </p>
          </div>

          {searchParams.message && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 text-center max-w-lg mx-auto">
              {searchParams.message}
            </div>
          )}

          <form action={signupAffiliate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@email.com"
                  className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expertise" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Your Expertise</Label>
                <Input
                  id="expertise"
                  name="expertise"
                  type="text"
                  placeholder="e.g. POS Sales, Food Influencer, Agency"
                  className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialInfluence" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Audience / Influence Size</Label>
                <Input
                  id="socialInfluence"
                  name="socialInfluence"
                  type="text"
                  placeholder="e.g. 10k Followers, 50 Restaurant Clients"
                  className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialMediaDetails" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Links (Socials / Website)</Label>
                <Input
                  id="socialMediaDetails"
                  name="socialMediaDetails"
                  type="text"
                  placeholder="e.g. instagram.com/janedoe"
                  className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sampleVideo" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Sample video/reel talk about NoMenu (Optional)</Label>
                <Input
                  id="sampleVideo"
                  name="sampleVideo"
                  type="text"
                  placeholder="e.g. instagram.com/reel/..."
                  className="h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Your Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Austin, TX"
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
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Label htmlFor="purpose" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Why do you want to join?</Label>
              <textarea
                id="purpose"
                name="purpose"
                rows={2}
                placeholder="How do you plan to promote Nomenu?"
                className="w-full flex min-h-[60px] bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 shadow-sm text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="flex flex-col items-center text-center space-y-2 pt-8 border-t border-slate-100">
              <Label htmlFor="referralCode" className="text-slate-700 font-bold text-sm uppercase tracking-wider">Create Custom Promo Code</Label>
              <p className="text-[11px] text-slate-500 mb-2">This is the code you will share (e.g. FOODIE50).</p>
              <Input
                id="referralCode"
                name="referralCode"
                placeholder="ATLANTAEATS"
                className="h-14 bg-amber-50/50 border-amber-200 text-amber-900 font-mono font-black text-center text-lg uppercase rounded-xl px-4 shadow-sm focus-visible:ring-amber-500 max-w-sm"
                required
              />
            </div>

            <div className="pt-4 flex justify-center">
              <Button type="submit" className="w-full md:w-auto md:min-w-[240px] h-14 text-base font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all">
                Submit Application
              </Button>
            </div>
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
