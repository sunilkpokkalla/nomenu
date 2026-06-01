"use client";

import { Check, Clipboard, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text }: { text: string }) {
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
    <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
      {copied ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600 animate-in fade-in duration-200" />
          Copied!
        </>
      ) : (
        <>
          <Clipboard className="mr-1.5 h-3.5 w-3.5" />
          Copy Link
        </>
      )}
    </Button>
  );
}

export function DownloadButton({ qrImageUrl, label, disabled = false }: { qrImageUrl: string; label: string; disabled?: boolean }) {
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
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={disabled || downloading} className="flex-1">
      <Download className={`mr-1.5 h-3.5 w-3.5 ${downloading ? "animate-pulse" : ""}`} />
      {downloading ? "Downloading..." : "Download QR"}
    </Button>
  );
}
