"use client";

import { Check, Clipboard, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, iconOnly = false }: { text: string; iconOnly?: boolean }) {
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
      variant={iconOnly ? "ghost" : "outline"} 
      size={iconOnly ? "icon" : "sm"} 
      onClick={handleCopy} 
      className={iconOnly ? "h-8 w-8 text-slate-500 hover:text-slate-900 rounded-full" : "flex-1"}
      title={iconOnly ? "Copy Link" : undefined}
    >
      {copied ? (
        <>
          <Check className={`${iconOnly ? "" : "mr-1.5 "}h-4 w-4 text-emerald-600 animate-in fade-in duration-200`} />
          {!iconOnly && "Copied!"}
        </>
      ) : (
        <>
          <Clipboard className={`${iconOnly ? "" : "mr-1.5 "}h-4 w-4`} />
          {!iconOnly && "Copy Link"}
        </>
      )}
    </Button>
  );
}

export function DownloadButton({ qrImageUrl, label, disabled = false, iconOnly = false }: { qrImageUrl: string; label: string; disabled?: boolean; iconOnly?: boolean }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      // Clean up filename
      const safeLabel = label.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.download = `${safeLabel}_qrcode.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download QR code image directly: ", err);
      // Fallback: open in new window/tab
      window.open(qrImageUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button 
      variant={iconOnly ? "ghost" : "outline"} 
      size={iconOnly ? "icon" : "sm"} 
      onClick={handleDownload} 
      disabled={disabled || downloading} 
      className={iconOnly ? "h-8 w-8 text-slate-500 hover:text-slate-900 rounded-full" : "flex-1"}
      title={iconOnly ? "Download QR" : undefined}
    >
      <Download className={`${iconOnly ? "" : "mr-1.5 "}h-4 w-4 ${downloading ? "animate-pulse" : ""}`} />
      {!iconOnly && (downloading ? "Downloading..." : "Download QR")}
    </Button>
  );
}
