"use client";
import { useEffect } from "react";

export function TabSaver({ tab }: { tab: string }) {
  useEffect(() => {
    document.cookie = `last_foh_tab=${tab}; path=/; max-age=31536000`;
  }, [tab]);
  return null;
}
