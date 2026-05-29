"use client";

import { useState } from "react";
import { ExternalLink, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CopyButton, DownloadButton } from "@/components/dashboard/qr-actions";
import Image from "next/image";

interface MenuQrModalProps {
  menuName: string;
  publicUrl: string;
}

export function MenuQrModal({ menuName, publicUrl }: MenuQrModalProps) {
  const [open, setOpen] = useState(false);
  
  const qrImageApiUrl = `/api/qr?data=${encodeURIComponent(publicUrl)}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <QrCode className="mr-1.5 h-3.5 w-3.5" />
          QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Menu QR Code</DialogTitle>
          <DialogDescription>
            Scan this code to instantly view {menuName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center pt-2 pb-4 space-y-6">
          <a
            href={qrImageApiUrl}
            target="_blank"
            rel="noreferrer"
            className="relative aspect-square w-56 rounded-xl border bg-white p-3 shadow-inner hover:opacity-90 transition-opacity cursor-pointer group"
            title="Click to open full size QR image"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src={qrImageApiUrl}
              alt={`QR Code for ${menuName}`}
              className="h-full w-full object-contain"
            fill />
            <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-slate-700 bg-white/80 p-1.5 rounded-md shadow-sm" />
            </div>
          </a>

          <div className="w-full space-y-2">
            <div className="flex gap-2">
              <CopyButton text={publicUrl} />
              <DownloadButton qrImageUrl={qrImageApiUrl} label={menuName} />
            </div>
            
            <div className="flex items-center justify-center border-t pt-3 mt-4">
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-slate-400 font-mono truncate max-w-[250px] hover:underline"
              >
                {publicUrl}
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
