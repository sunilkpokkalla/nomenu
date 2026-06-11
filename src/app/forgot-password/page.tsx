import Link from "next/link";
import { QrCode, ArrowLeft, Mail } from "lucide-react";
import Image from "next/image";

import { forgotPassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ForgotPasswordPage(
  props: {
    searchParams: Promise<{ message?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const message = searchParams.message;
  
  // Determine if message is an error or success alert
  const isSuccess = message && (message.includes("Check") || message.includes("check") || message.includes("sent") || message.includes("Sent"));

  return (
    <main className="flex min-h-screen bg-white font-sans-vibrant">
      {/* LEFT SIDE - EDITORIAL IMAGE */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-slate-950">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/auth-bg-forgot.png" 
            alt="Vintage lock and key" 
            fill 
            className="object-cover opacity-70"
            priority
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10" />
        </div>

        {/* Brand Text over Image */}
        <div className="relative z-10 flex flex-col justify-end p-16 w-full">
          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl font-extrabold text-white leading-[1.1] tracking-tight">
              Get back to managing your restaurant.
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              We'll help you securely reset your password so you can get back to business.
            </p>
          </div>
        </div>

        {/* Absolute Back Button */}
        <Link href="/login" className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors z-20 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>

      {/* RIGHT SIDE - MINIMALIST FORM */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">
        
        {/* Mobile Back Button */}
        <Link href="/login" className="lg:hidden absolute top-6 left-6 text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold transition-colors z-20">
          <ArrowLeft className="w-4 h-4" />
          Login
        </Link>

        <div className="w-full max-w-[420px] space-y-10">
          
          {/* Header */}
          <div className="space-y-3 text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 shadow-sm mb-4">
              <QrCode className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-[2rem] font-black text-slate-950 tracking-tight leading-tight">Forgot Password</h1>
            <p className="text-slate-500 font-medium text-base">
              Enter your email address and we'll send you a recovery link to reset your password.
            </p>
          </div>

          {message && (
            <div
              className={`rounded-xl border px-4 py-3.5 text-sm font-medium flex items-start gap-3 text-left ${
                isSuccess
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-600"
              }`}
            >
              {isSuccess ? (
                <Mail className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0 text-xs mt-0.5">!</div>
              )}
              <div>{message}</div>
            </div>
          )}

          <div className="space-y-6">
            <form action={forgotPassword} className="space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@restaurant.com"
                  className="h-14 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-950 focus-visible:border-slate-950 rounded-xl px-4 text-base shadow-sm"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-14 bg-slate-950 hover:bg-slate-900 text-white font-bold text-base mt-2 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Send Reset Link
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
