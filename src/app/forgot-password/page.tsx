import Link from "next/link";
import { QrCode, ArrowLeft, Mail } from "lucide-react";

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
    <main className="flex min-h-screen bg-slate-50 items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Soft glowing orb behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
      
      {/* White Card */}
      <div className="w-full max-w-[460px] bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-10 z-10 relative border border-slate-100/50">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 text-primary mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
              <QrCode className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold text-primary">NoMenu</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Forgot Password</h1>
          <p className="text-center text-sm text-slate-500 px-2">
            Enter your email address and we'll send you a recovery link to reset your password.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3.5 text-sm flex items-start gap-3 ${
              isSuccess
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-600"
            }`}
          >
            {isSuccess ? (
              <Mail className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0 text-xs mt-0.5">!</div>
            )}
            <div>{message}</div>
          </div>
        )}

        <form action={forgotPassword} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-600 font-normal">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@email.com"
              className="h-12 shadow-sm border-slate-200 focus-visible:ring-primary text-base px-4"
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base mt-2 shadow-sm">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
