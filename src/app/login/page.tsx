import Link from "next/link";
import { QrCode, Star } from "lucide-react";

import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage(
  props: {
    searchParams: Promise<{ message?: string; next?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <main className="flex min-h-screen bg-slate-50">
      {/* LEFT SIDE - SOCIAL PROOF */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center items-center relative overflow-hidden p-12">
        {/* Soft glowing orb behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-lg text-center space-y-16">
          {/* Main Review */}
          <div className="space-y-2">
            <h2 className="text-[2.75rem] font-medium text-slate-800 tracking-tight">4.9 out of 5</h2>
            <p className="text-slate-500 font-medium tracking-wide">based on 5000+ reviews</p>
          </div>

          {/* Review 1 */}
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-1.5 text-amber-400">
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
            </div>
            <p className="text-xl font-medium text-slate-800 leading-relaxed px-4">
              “Since switching to NoMenu, our tables turn 15% faster. The QR codes are lightning fast!”
            </p>
            <p className="text-sm text-slate-500 font-medium">— Sarah J., General Manager</p>
          </div>

          {/* Review 2 */}
          <div className="space-y-4 pt-4">
            <div className="flex justify-center items-center gap-1 text-amber-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <p className="text-lg font-medium text-slate-800 leading-relaxed px-8">
              “Updating our menu used to mean reprinting 100 pages. Now I just click a button. Absolute game-changer.”
            </p>
            <p className="text-sm text-slate-500 font-medium">— David C., Restaurant Owner</p>
          </div>

          {/* Trusted By */}
          <div className="pt-10 flex items-center justify-center gap-8 text-slate-400 font-medium text-sm uppercase tracking-wider w-full">
             <span className="shrink-0">Trusted by</span>
             <div className="flex items-center gap-8 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-500">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg" alt="McDonalds" className="h-6 w-auto" />
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg" alt="Starbucks" className="h-8 w-auto" />
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg" alt="Subway" className="h-4 w-auto" />
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg" alt="Dominos" className="h-7 w-auto" />
             </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="absolute bottom-8 left-12 text-slate-400 text-sm">
          ©AmBrightTech LLC
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        {/* White Card */}
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-12 z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 text-primary mb-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                <QrCode className="h-7 w-7" />
              </span>
              <span className="text-2xl font-bold text-primary">NoMenu</span>
            </div>
            <h1 className="text-[1.75rem] font-normal text-slate-800 mb-3">Log in to your account</h1>
            <p className="text-center text-sm text-slate-500 px-4">
              By clicking Continue, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and our <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          {searchParams.message && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {searchParams.message}
            </div>
          )}

          {/* Social Logins */}
          <div className="space-y-3 mb-6">
            <form action={login}>
              <input type="hidden" name="next" value={searchParams.next ?? "/dashboard"} />
              <input type="hidden" name="email" value="demo@nomenu.com" />
              <input type="hidden" name="password" value="demo123" />
              <Button type="submit" variant="outline" className="w-full h-12 bg-[#1A73E8] hover:bg-[#1557B0] border-transparent text-white font-medium flex items-center justify-center gap-3 text-base shadow-sm">
                <div className="bg-white p-1 rounded-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                Continue with Demo Account
              </Button>
            </form>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-medium">or</span>
            </div>
          </div>

          <form action={login} className="space-y-5">
            <input type="hidden" name="next" value={searchParams.next ?? "/dashboard"} />
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 font-normal">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="name@email.com" className="h-12 shadow-sm border-slate-200 focus-visible:ring-primary text-base px-4" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600 font-normal">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-12 shadow-sm border-slate-200 focus-visible:ring-primary text-base px-4"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base mt-4 shadow-sm">
              CONTINUE
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-800 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
