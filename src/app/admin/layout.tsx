import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/auth/actions";

import { AdminLogin } from "./components/admin-login";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return <AdminLogin />;
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "admin@nomenu.us").split(",");
  if (!adminEmails.includes(user.email)) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="font-bold tracking-tight text-slate-900">Super Admin Portal</h1>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-500 font-medium">{user.email}</span>
            <form action={logout}>
              <button 
                type="submit"
                className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Admin Sub-navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 overflow-x-auto">
          <nav className="flex items-center gap-6 text-sm font-bold h-12 whitespace-nowrap min-w-max">
            <Link 
              href="/admin" 
              className="text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center border-b-2 border-transparent hover:border-slate-300 data-[active=true]:border-indigo-600 data-[active=true]:text-indigo-600"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/restaurants" 
              className="text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center border-b-2 border-transparent hover:border-slate-300 data-[active=true]:border-indigo-600 data-[active=true]:text-indigo-600"
            >
              Restaurants
            </Link>
            <Link 
              href="/admin/marketing" 
              className="text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center border-b-2 border-transparent hover:border-slate-300 data-[active=true]:border-indigo-600 data-[active=true]:text-indigo-600"
            >
              Campaigns
            </Link>
            <Link 
              href="/admin/partners" 
              className="text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center border-b-2 border-transparent hover:border-slate-300 data-[active=true]:border-indigo-600 data-[active=true]:text-indigo-600"
            >
              Partners
            </Link>
            <Link 
              href="/admin/payouts" 
              className="text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center border-b-2 border-transparent hover:border-slate-300 data-[active=true]:border-indigo-600 data-[active=true]:text-indigo-600"
            >
              Payouts
            </Link>
            <Link 
              href="/admin/support" 
              className="text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center border-b-2 border-transparent hover:border-slate-300 data-[active=true]:border-indigo-600 data-[active=true]:text-indigo-600"
            >
              Support
            </Link>
            <Link 
              href="/admin/billing" 
              className="text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center border-b-2 border-transparent hover:border-slate-300 data-[active=true]:border-indigo-600 data-[active=true]:text-indigo-600"
            >
              Billing
            </Link>
            <Link 
              href="/admin/settings" 
              className="text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center border-b-2 border-transparent hover:border-slate-300 data-[active=true]:border-indigo-600 data-[active=true]:text-indigo-600"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
