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
  if (process.env.NODE_ENV !== 'development' && !adminEmails.includes(user.email)) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="border-b border-white/10 bg-black sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="font-medium tracking-tight">Super Admin Portal</h1>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <span className="text-white/50">{user.email}</span>
            <form action={logout}>
              <button 
                type="submit"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Admin Sub-navigation */}
      <div className="border-b border-white/10 bg-black/50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 text-sm font-medium h-12">
            <Link 
              href="/admin" 
              className="text-white/70 hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white/50 data-[active=true]:border-indigo-500 data-[active=true]:text-white"
            >
              Fleet Overview
            </Link>
            <Link 
              href="/admin/marketing" 
              className="text-white/70 hover:text-white transition-colors h-full flex items-center border-b-2 border-transparent hover:border-white/50 data-[active=true]:border-indigo-500 data-[active=true]:text-white"
            >
              Campaigns
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
