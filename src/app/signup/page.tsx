import Link from "next/link";
import { QrCode, Star } from "lucide-react";

import { signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SignupPage(
  props: {
    searchParams: Promise<{ message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <main className="flex min-h-screen bg-[#FFF4ED]">
      {/* LEFT SIDE - SOCIAL PROOF */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center items-center relative overflow-hidden p-12">
        {/* Soft glowing orb behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-lg text-center space-y-16">
          {/* Main Review */}
          <div className="space-y-2">
            <h2 className="text-[2.75rem] font-medium text-slate-800 tracking-tight">4.9 out of 5</h2>
            <p className="text-slate-500 font-medium tracking-wide">based on 5000+ reviews</p>
          </div>

          {/* Review 1 */}
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-1.5 text-[#F97316]">
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
            <div className="flex justify-center items-center gap-1 text-[#F97316]">
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
          <div className="pt-10 flex flex-col items-center justify-center gap-6 text-slate-400 font-medium text-sm uppercase tracking-wider">
             <span>Trusted by top restaurants</span>
             <div className="flex items-center gap-10 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-500">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg" alt="McDonalds" className="h-8 w-auto" />
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg" alt="Starbucks" className="h-10 w-auto" />
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg" alt="Subway" className="h-5 w-auto" />
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg" alt="Dominos" className="h-8 w-auto" />
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
            <div className="flex items-center gap-3 text-[#F97316] mb-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F97316] text-white shadow-sm">
                <QrCode className="h-7 w-7" />
              </span>
              <span className="text-2xl font-bold text-[#F97316]">NoMenu</span>
            </div>
            <h1 className="text-[1.75rem] font-normal text-slate-800 mb-3">Sign Up for Free</h1>
            <p className="text-center text-sm text-slate-500 px-4">
              By clicking Continue, you agree to our <Link href="#" className="text-[#F97316] hover:underline">Terms of Service</Link> and our <Link href="#" className="text-[#F97316] hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          {searchParams.message && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {searchParams.message}
            </div>
          )}


          <form action={signup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="restaurantName" className="text-slate-600 font-normal">Restaurant Name</Label>
              <Input id="restaurantName" name="restaurantName" placeholder="My Awesome Restaurant" className="h-12 shadow-sm border-slate-200 focus-visible:ring-[#F97316] text-base px-4" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 font-normal">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="name@email.com" className="h-12 shadow-sm border-slate-200 focus-visible:ring-[#F97316] text-base px-4" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600 font-normal">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-12 shadow-sm border-slate-200 focus-visible:ring-[#F97316] text-base px-4"
                minLength={8}
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium text-base mt-4 shadow-sm">
              CONTINUE
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-800 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F97316] hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
