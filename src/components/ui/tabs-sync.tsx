"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

export function TabsSync({ 
  defaultValue, 
  className, 
  children 
}: { 
  defaultValue: string; 
  className?: string; 
  children: React.ReactNode; 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlTab = searchParams.get("tab");
      if (urlTab) return urlTab;
      
      const savedTab = localStorage.getItem(`tab_sync_${pathname}`);
      if (savedTab) return savedTab;
    }
    return defaultValue;
  });

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
      localStorage.setItem(`tab_sync_${pathname}`, urlTab);
    }
  }, [searchParams, activeTab, pathname]);

  const handleValueChange = (value: string) => {
    setActiveTab(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`tab_sync_${pathname}`, value);
    }
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // When loading for the first time with a saved tab but no URL param, sync URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlTab = searchParams.get("tab");
      const savedTab = localStorage.getItem(`tab_sync_${pathname}`);
      if (!urlTab && savedTab && savedTab !== defaultValue) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", savedTab);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [defaultValue, pathname, router, searchParams]);

  return (
    <Tabs 
      value={activeTab} 
      className={className}
      onValueChange={handleValueChange}
    >
      {children}
    </Tabs>
  );
}
