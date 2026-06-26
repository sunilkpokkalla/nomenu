"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function TrackerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      // Set the cookie client-side to ensure it bypasses any CDN caching issues
      document.cookie = `nomenu_ref_code=${refCode}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    }
  }, [searchParams]);

  return null;
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
