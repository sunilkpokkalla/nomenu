"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";

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

  return (
    <Tabs 
      defaultValue={defaultValue} 
      className={className}
      onValueChange={(value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }}
    >
      {children}
    </Tabs>
  );
}
