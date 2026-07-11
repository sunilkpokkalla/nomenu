"use client";

import dynamic from "next/dynamic";

export const AnalyticsDashboard = dynamic(
  () => import("./analytics-dashboard").then((mod) => mod.AnalyticsDashboard),
  { ssr: false, loading: () => <div className="animate-pulse h-[600px] w-full bg-slate-100 rounded-3xl" /> }
);
