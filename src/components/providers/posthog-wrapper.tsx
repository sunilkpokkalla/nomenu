"use client";

import dynamic from "next/dynamic";

export const PostHogWrapper = dynamic(
  () => import("./posthog-provider").then((mod) => mod.CSPostHogProvider),
  { ssr: false }
);
