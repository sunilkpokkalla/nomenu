"use client";

import { Shield } from "lucide-react";
import { login } from "@/app/auth/actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

export function AdminLogin() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="bg-indigo-50 p-3 rounded-full">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Super Admin Portal</h2>
          <p className="text-slate-500 text-sm">
            Restricted access. Please log in with your administrator credentials.
          </p>
        </div>

        {message && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
            {message}
          </div>
        )}

        <form action={login} className="space-y-4">
          <input type="hidden" name="next" value="/admin" />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Admin Email</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="admin@nomenu.us"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-4 py-2.5 mt-4 transition-colors"
          >
            Authenticate
          </button>
          
          <div className="text-center pt-4">
            <p className="text-xs text-neutral-500">
              Forgot password? Contact <a href="mailto:support@nomenu.us" className="text-indigo-400 hover:text-indigo-300">support@nomenu.us</a> for a reset.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
