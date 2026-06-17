"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SupabaseHashListener() {
  const router = useRouter();

  useEffect(() => {
    // Supabase auth callback from admin.generateLink returns `#access_token=...`
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      const supabase = createClient();
      
      // We check session. The @supabase/ssr browser client will automatically 
      // parse the hash fragment and convert it into a cookie for us.
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // Clear the hash from the URL for cleanliness
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          
          // Redirect the user to the dashboard
          router.replace("/dashboard");
        }
      });
      
      // Also set up an auth listener in case it takes a moment to process the hash
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.replace("/dashboard");
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [router]);

  return null;
}
