"use client";

import Link from "next/link";

import { useState } from "react";
import { Share2, Check, Link as LinkIcon, ShoppingBag, CalendarClock, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Lock } from "lucide-react";

export function MenuShareModal({ baseMenuUrl, menuName, plan }: { baseMenuUrl: string, menuName: string, plan: string }) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = async (url: string, type: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(type);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getQrUrl = (url: string) => `/api/qr?data=${encodeURIComponent(url)}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl bg-white hover:bg-slate-50 border-slate-200" title="Share Menu Links">
          <Share2 className="h-4 w-4 text-slate-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-3xl p-8 bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto top-[5vh] translate-y-0 mb-[5vh]">
        <DialogHeader className="mb-6 text-center">
          <DialogTitle className="text-3xl font-black tracking-tight text-slate-900">
            Share "{menuName}"
          </DialogTitle>
          <DialogDescription className="text-base text-slate-500 mt-2">
            Use these dedicated links and QR codes to instantly route customers to the correct ordering experience.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Standard Dine-In */}
          <div className="flex flex-col items-center bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="bg-slate-100 p-3 rounded-2xl mb-4">
              <LinkIcon className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Dine-In</h3>
            <p className="text-xs text-slate-500 text-center mt-1 mb-5 h-8">Default menu link. Asks for Table Number.</p>
            
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm mb-5 w-full aspect-square relative flex items-center justify-center">
              <img src={getQrUrl(baseMenuUrl)} alt="Dine-In QR" className="w-full h-full object-contain mix-blend-multiply" />
            </div>

            <div className="flex w-full gap-2 mt-auto">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-10 border-slate-200"
                onClick={() => handleCopy(baseMenuUrl, 'dine_in')}
              >
                {copiedLink === 'dine_in' ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
              <Button 
                variant="default" 
                className="flex-1 rounded-xl h-10 bg-slate-900 text-white"
                asChild
              >
                <a href={getQrUrl(baseMenuUrl)} download={`dine-in-qr.png`} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Pickup */}
          <div className="flex flex-col items-center bg-orange-50/30 border border-orange-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            {plan !== 'enterprise' && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white p-3 rounded-full shadow-lg border border-slate-100 mb-3">
                  <Lock className="w-6 h-6 text-orange-500" />
                </div>
                <h4 className="font-bold text-slate-900">Enterprise Feature</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4">Upgrade to unlock Takeaway ordering.</p>
                <Button size="sm" variant="outline" className="h-8 rounded-full border-orange-200 text-orange-700 hover:bg-orange-50" asChild>
                  <Link href="/dashboard/settings">Upgrade Plan</Link>
                </Button>
              </div>
            )}
            <div className="bg-orange-100 p-3 rounded-2xl mb-4 text-orange-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Takeaway</h3>
            <p className="text-xs text-slate-500 text-center mt-1 mb-5 h-8">Forces phone number & pickup time input.</p>
            
            <div className="bg-white p-3 rounded-2xl border border-orange-100/50 shadow-sm mb-5 w-full aspect-square relative flex items-center justify-center">
              <img src={getQrUrl(`${baseMenuUrl}?mode=pickup`)} alt="Pickup QR" className="w-full h-full object-contain mix-blend-multiply" />
            </div>

            <div className="flex w-full gap-2 mt-auto">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-10 border-orange-200 hover:bg-orange-50 text-orange-700"
                onClick={() => handleCopy(`${baseMenuUrl}?mode=pickup`, 'pickup')}
              >
                {copiedLink === 'pickup' ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
              <Button 
                variant="default" 
                className="flex-1 rounded-xl h-10 bg-orange-600 hover:bg-orange-700 text-white"
                asChild
              >
                <a href={getQrUrl(`${baseMenuUrl}?mode=pickup`)} download={`pickup-qr.png`} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Reserve */}
          <div className="flex flex-col items-center bg-indigo-50/30 border border-indigo-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            {plan !== 'enterprise' && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white p-3 rounded-full shadow-lg border border-slate-100 mb-3">
                  <Lock className="w-6 h-6 text-indigo-500" />
                </div>
                <h4 className="font-bold text-slate-900">Enterprise Feature</h4>
                <p className="text-xs text-slate-600 mt-1 mb-4">Upgrade to unlock Priority Reserve.</p>
                <Button size="sm" variant="outline" className="h-8 rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" asChild>
                  <Link href="/dashboard/settings">Upgrade Plan</Link>
                </Button>
              </div>
            )}
            <div className="bg-indigo-100 p-3 rounded-2xl mb-4 text-indigo-600">
              <CalendarClock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Reserve</h3>
            <p className="text-xs text-slate-500 text-center mt-1 mb-5 h-8">Forces party size & reservation time.</p>
            
            <div className="bg-white p-3 rounded-2xl border border-indigo-100/50 shadow-sm mb-5 w-full aspect-square relative flex items-center justify-center">
              <img src={getQrUrl(`${baseMenuUrl}?mode=reserve`)} alt="Reserve QR" className="w-full h-full object-contain mix-blend-multiply" />
            </div>

            <div className="flex w-full gap-2 mt-auto">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-10 border-indigo-200 hover:bg-indigo-50 text-indigo-700"
                onClick={() => handleCopy(`${baseMenuUrl}?mode=reserve`, 'reserve')}
              >
                {copiedLink === 'reserve' ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
              <Button 
                variant="default" 
                className="flex-1 rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 text-white"
                asChild
              >
                <a href={getQrUrl(`${baseMenuUrl}?mode=reserve`)} download={`reserve-qr.png`} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
