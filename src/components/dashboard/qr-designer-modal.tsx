"use client";

import { X, Printer, Download, Sparkles, Palette, Wifi, Image as ImageIcon, ChevronDown, Save } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toPng } from "html-to-image";
import { templates, templateCategories, type TemplateKey } from "./qr-templates/index";
import Image from "next/image";
import { ImageUploader } from "@/components/dashboard/image-uploader";

interface QRDesignerModalProps {
  qr: {
    id: string;
    label: string | null;
    scan_count: number;
    menu_id: string;
    mode?: string | null;
  };
  restaurant: {
    name: string;
    primary_color: string | null;
    accent_color: string | null;
    wifi_password: string | null;
    logo_url?: string | null;
    plan?: string | null;
  };
  qrImageApiUrl: string;
  iconOnly?: boolean;
}



export function QrDesignerModal({ qr, restaurant, qrImageApiUrl, iconOnly = false }: QRDesignerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [template, setTemplate] = useState<TemplateKey>("instagram-square");
  
  // Custom brand settings
  const [brandName, setBrandName] = useState(restaurant.name);
  const [headline, setHeadline] = useState("Scan to View Menu");
  const [subtext, setSubtext] = useState(qr.label || "Table");
  const [showWifi, setShowWifi] = useState(!!restaurant.wifi_password);
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(restaurant.logo_url || "");
  const [qrColor, setQrColor] = useState<string>("#0F172A");
  const [isSaved, setIsSaved] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    if (isOpen) {
      try {
        const savedStr = localStorage.getItem(`qr_design_${restaurant.name}`);
        if (savedStr) {
          const parsed = JSON.parse(savedStr);
          if (parsed.template) setTemplate(parsed.template);
          if (parsed.brandName) setBrandName(parsed.brandName);
          if (parsed.headline) setHeadline(parsed.headline);
          if (parsed.customLogoUrl !== undefined) setCustomLogoUrl(parsed.customLogoUrl);
          if (parsed.qrColor) setQrColor(parsed.qrColor);
          if (typeof parsed.showWifi === 'boolean') setShowWifi(parsed.showWifi);
        }
      } catch (err) {
        console.error("Failed to load saved QR design", err);
      }
    }
  }, [isOpen, restaurant.name]);

  const handleSaveDesign = () => {
    const design = { template, brandName, headline, customLogoUrl, qrColor, showWifi };
    localStorage.setItem(`qr_design_${restaurant.name}`, JSON.stringify(design));
    window.dispatchEvent(new Event('qr_design_saved'));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nomenu.us';
  let fullMenuUrl = `${origin}/menu/${qr.menu_id}?qr=${qr.id}`;
  if (qr.mode && qr.mode !== 'dine_in') {
    fullMenuUrl += `&mode=${qr.mode}`;
  }

  const colorStart = restaurant.primary_color || "#2563EB";
  const colorEnd = restaurant.accent_color || "#F59E0B";

  // html-to-image downloader
  const handleDownloadPng = useCallback(async () => {
    if (printRef.current === null) {
      return;
    }
    setIsDownloading(true);

    try {
      // Create high-res image
      const dataUrl = await toPng(printRef.current, {
        cacheBust: true,
        pixelRatio: 2, // 2x resolution for print
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      const safeLabel = subtext.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      downloadLink.download = `${brandName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${safeLabel}_${template}_qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Failed to generate image", err);
      // Fallback
      window.open(qrImageApiUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  }, [brandName, subtext, template, qrImageApiUrl]);

  // Window printer trigger
  const handlePrint = useCallback(async () => {
    if (printRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(printRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const printLayout = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Brand Card - ${brandName}</title>
            <style>
              @page {
                size: auto;
                margin: 0;
              }
              body {
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: #ffffff;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <Image src="${dataUrl}" alt="QR Print Card" fill />
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(printLayout);
      printWindow.document.close();
    } catch (error) {
      console.error("Print generation failed: ", error);
      window.print();
    }
  }, [brandName]);

  const SelectedTemplate = templates[template] || templates["classic"];

  return (
    <>
      <Button
        variant={iconOnly ? "ghost" : "outline"}
        size={iconOnly ? "icon" : "sm"}
        onClick={() => setIsOpen(true)}
        className={iconOnly ? "h-8 w-8 text-slate-500 hover:text-slate-900 rounded-full" : "w-full bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"}
        title={iconOnly ? "Design Card" : undefined}
      >
        <Sparkles className={`${iconOnly ? "" : "mr-1.5 "}h-4 w-4`} />
        {!iconOnly && "Design Card"}
      </Button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/20 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            
            {/* LEFT SIDE: PREVIEW CONTAINER */}
            <div className="flex-1 bg-gradient-to-br from-slate-100 via-indigo-50/60 to-purple-50/40 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/50 overflow-y-auto min-h-[460px] md:min-h-0 relative">
              <div className="mb-4 text-center absolute top-6">
                <span className="text-[11px] uppercase font-black tracking-[0.2em] text-indigo-400 drop-shadow-sm flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-3.5 h-3.5" /> Live Print Card Preview
                </span>
              </div>
              
              {/* Scaled wrapper for preview so it fits nicely on smaller screens */}
              <div className="transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] origin-center mt-8 relative">
                
                {/* Floating Glow behind card */}
                <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full scale-90 translate-y-4 pointer-events-none" />
                
                {/* We render the template directly inside a ref for html-to-image */}
                <div ref={printRef} className="relative z-10 shadow-2xl shadow-slate-900/10 rounded-2xl overflow-hidden ring-1 ring-black/5">
                  <SelectedTemplate
                    brandName={brandName}
                    headline={headline}
                    subtext={subtext}
                    wifiPassword={showWifi ? restaurant.wifi_password : null}
                    logoUrl={customLogoUrl || null}
                    qrImageUrl={`${qrImageApiUrl}${qrImageApiUrl.includes('?') ? '&' : '?'}color=${encodeURIComponent(qrColor)}`}
                    qrDataUrl={fullMenuUrl}
                    colorStart={colorStart}
                    colorEnd={colorEnd}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: CUSTOMIZER PANEL */}
            <div className="w-full md:w-[450px] flex flex-col overflow-hidden max-h-[50vh] md:max-h-none bg-white">
              
              {/* STICKY HEADER */}
              <div className="flex items-center justify-between p-6 lg:p-8 pb-4 border-b border-slate-100 bg-white shrink-0 relative z-10">
                <h2 className="text-xl font-black text-slate-950 flex items-center gap-2 tracking-tight">
                  <Palette className="h-5 w-5 text-indigo-600" />
                  Customize QR Card
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="p-6 lg:p-8 pt-5 flex-1 overflow-y-auto flex flex-col justify-between">
                <div className="space-y-7">
                  {/* TEMPLATE PICKER */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">Card Template Style</Label>
                  <div className="relative">
                    <select
                      value={template}
                      onChange={(e) => {
                        const selectedId = e.target.value as TemplateKey;
                        const isFreePlan = !restaurant.plan || restaurant.plan.toLowerCase() === "free";
                        const isLocked = isFreePlan && !["classic", "instagram-square", "minimalist"].includes(selectedId);
                        
                        if (!isLocked) {
                          setTemplate(selectedId);
                        }
                      }}
                      className="w-full h-12 px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none cursor-pointer shadow-sm hover:border-slate-300 transition-all"
                    >
                      {templateCategories.map((category) => (
                        <optgroup key={category.id} label={category.name} className="font-bold text-slate-500">
                          {category.templates.map((t: {id: string; name: string}) => {
                            const isFreePlan = !restaurant.plan || restaurant.plan.toLowerCase() === "free";
                            const isLocked = isFreePlan && !["classic", "instagram-square", "minimalist"].includes(t.id);
                            return (
                                <option 
                                  key={t.id} 
                                  value={t.id} 
                                  disabled={isLocked}
                                  className="font-medium text-slate-900"
                                >
                                  {t.name} {isLocked ? " 🔒 (PREMIUM)" : ""}
                                </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <ChevronDown className="h-4 w-4" strokeWidth={3} />
                    </div>
                  </div>
                  {(!restaurant.plan || restaurant.plan.toLowerCase() === "free") && (
                    <div className="mt-2 p-3 bg-indigo-50 rounded-xl flex items-start gap-2 border border-indigo-100 shadow-sm">
                      <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-indigo-800 font-medium leading-relaxed">
                        <strong className="text-indigo-950 block mb-0.5">Unlock Premium Designs</strong>
                        Upgrade your plan to access 10+ premium layout designs and color themes.
                      </p>
                    </div>
                  )}
                </div>



                {/* TEXT FIELDS */}
                <div className="space-y-2.5">
                  <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">Card Typography</Label>
                  <div className="space-y-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="brandName" className="text-[10px] font-bold text-slate-500">Brand / Restaurant Name</Label>
                      <Input id="brandName" size={32} value={brandName} onChange={(e) => setBrandName(e.target.value)} className="h-10 text-xs font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="headline" className="text-[10px] font-bold text-slate-500">Main Call-To-Action</Label>
                      <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="h-10 text-xs font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subtext" className="text-[10px] font-bold text-slate-500">Table Number / Label</Label>
                      <Input id="subtext" value={subtext} onChange={(e) => setSubtext(e.target.value)} className="h-10 text-xs font-bold rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* TOGGLES */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">Visibility & Branding</Label>
                  
                  {restaurant.wifi_password && (
                    <div className="flex items-center justify-between text-xs py-1.5 px-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => setShowWifi(!showWifi)}>
                      <label htmlFor="showWifi" className="font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                        <Wifi className="h-4 w-4 text-indigo-500" /> Print Guest WiFi Details
                      </label>
                      <input
                        type="checkbox"
                        id="showWifi"
                        checked={showWifi}
                        onChange={(e) => setShowWifi(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer pointer-events-none"
                      />
                    </div>
                  )}

                  <div className="flex flex-row items-start gap-3">
                    <div className="flex-1 space-y-1.5 pt-1">
                      <Label className="font-bold text-slate-700 flex items-center gap-2 px-1 text-xs">
                        <ImageIcon className="h-4 w-4 text-indigo-500" /> Card Logo
                      </Label>
                      <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        <ImageUploader folder="logo" hideLibrary={true}
                          value={customLogoUrl} 
                          onChange={setCustomLogoUrl} 
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1.5 pt-1">
                      <Label htmlFor="qrColor" className="font-bold text-slate-700 flex items-center gap-2 px-1 text-xs">
                        <Palette className="h-4 w-4 text-indigo-500" /> QR Color
                      </Label>
                      <div className="flex flex-col gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        <Input 
                          id="qrColor" 
                          type="color" 
                          value={qrColor} 
                          onChange={(e) => setQrColor(e.target.value)} 
                          className="h-10 w-full p-1 cursor-pointer bg-white border-slate-300 rounded-lg"
                        />
                        <Input 
                          value={qrColor} 
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val && !val.startsWith('#')) val = '#' + val;
                            setQrColor(val);
                          }} 
                          className="h-9 w-full text-xs font-bold font-mono text-slate-700 bg-white border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 uppercase text-center"
                          placeholder="#0F172A"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-2 p-6 lg:p-8 pt-4 border-t border-slate-100 shrink-0 bg-white shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)] z-10 relative">
                <Button variant="outline" className={`h-11 font-extrabold text-xs tracking-wide rounded-xl border-slate-200 transition-all ${isSaved ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`} onClick={handleSaveDesign}>
                  <Save className="mr-2 h-4 w-4" strokeWidth={2.5} />
                  {isSaved ? "Saved as Default!" : "Save Design as Default"}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11 font-extrabold text-xs tracking-wide rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all" onClick={handlePrint} disabled={isDownloading}>
                    <Printer className="mr-2 h-4 w-4" strokeWidth={2.5} />
                    Print Card
                  </Button>
                  <Button className="h-11 font-extrabold text-xs tracking-wide rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all" onClick={handleDownloadPng} disabled={isDownloading}>
                    <Download className="mr-2 h-4 w-4" strokeWidth={2.5} />
                    {isDownloading ? "Generating..." : "Download PNG"}
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      , document.body)}
    </>
  );
}
