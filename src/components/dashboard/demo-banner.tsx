"use client";

import { AlertCircle } from "lucide-react";

export function DemoModeBanner() {
  return (
    <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-center text-blue-800 text-sm font-medium z-50 sticky top-0">
      <AlertCircle className="h-4 w-4 mr-2" />
      You are viewing the Read-Only Demo Account. Data changes are disabled.
    </div>
  );
}
