"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClientCopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button 
      onClick={handleCopy}
      className={className || "shrink-0 bg-white text-slate-900 hover:bg-slate-100 font-bold border-none shadow-md"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2 text-emerald-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </>
      )}
    </Button>
  );
}
