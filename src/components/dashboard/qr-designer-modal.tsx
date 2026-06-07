"use client";

import { X, Printer, Download, Sparkles, Palette, Wifi, Image as ImageIcon, ChevronDown } from "lucide-react";
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
  const [template, setTemplate] = useState<TemplateKey>("classic");
  
  // Custom brand settings
  const [brandName, setBrandName] = useState(restaurant.name);
  const [headline, setHeadline] = useState("Scan to View Menu");
  const [subtext, setSubtext] = useState(qr.label || "Table");
  const [showWifi, setShowWifi] = useState(!!restaurant.wifi_password);
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(restaurant.logo_url || "");

  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
        className={iconOnly ? "h-9 w-9 text-slate-500 hover:text-slate-900 rounded-full" : "w-full bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"}
        title={iconOnly ? "Design Card" : undefined}
      >
        <Sparkles className={`${iconOnly ? "" : "mr-1.5 "}h-4 w-4`} />
        {!iconOnly && "Design Card"}
      </Button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            
            {/* LEFT SIDE: PREVIEW CONTAINER */}
            <div className="flex-1 bg-slate-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/80 overflow-y-auto min-h-[460px] md:min-h-0 relative">
              <div className="mb-4 text-center absolute top-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Live Print Card Preview</span>
              </div>
              
              {/* Scaled wrapper for preview so it fits nicely on smaller screens */}
              <div className="transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] origin-center mt-8">
                {/* We render the template directly inside a ref for html-to-image */}
                <div ref={printRef}>
                  <SelectedTemplate
                    brandName={brandName}
                    headline={headline}
                    subtext={subtext}
                    wifiPassword={showWifi ? restaurant.wifi_password : null}
                    logoUrl={customLogoUrl || null}
                    qrImageUrl={qrImageApiUrl}
                    qrDataUrl={fullMenuUrl}
                    colorStart={colorStart}
                    colorEnd={colorEnd}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: CUSTOMIZER PANEL */}
            <div className="w-full md:w-[450px] p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-950 flex items-center gap-1.5">
                    <Palette className="h-5 w-5 text-primary" />
                    Customize QR Card
                  </h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <hr />

                {/* TEMPLATE PICKER */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Card Template Style (10 Designs)</Label>
                  <div className="relative">
                    <select
                      value={template}
                      onChange={(e) => {
                        const selectedId = e.target.value as TemplateKey;
                        const isFreePlan = !restaurant.plan || restaurant.plan.toLowerCase() === "free";
                        const isLocked = isFreePlan && selectedId !== "classic";
                        
                        if (!isLocked) {
                          setTemplate(selectedId);
                        }
                      }}
                      className="w-full h-11 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                    >
                      {templateCategories.map((category) => (
                        <optgroup key={category.id} label={category.name}>
                          {category.templates.map((t: {id: string; name: string}) => {
                            const isFreePlan = !restaurant.plan || restaurant.plan.toLowerCase() === "free";
                            const isLocked = isFreePlan && t.id !== "classic";
                            return (
                              <option 
                                key={t.id} 
                                value={t.id} 
                                disabled={isLocked}
                              >
                                {t.name} {isLocked ? "(PRO)" : ""}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                  {(!restaurant.plan || restaurant.plan.toLowerCase() === "free") && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-[10px] text-amber-800 font-medium text-center">
                        Upgrade to Growth to unlock premium card designs.
                      </p>
                    </div>
                  )}
                </div>



                {/* TEXT FIELDS */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Card Texts</Label>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="brandName" className="text-[10px] text-slate-400">Brand / Restaurant Name</Label>
                      <Input id="brandName" size={32} value={brandName} onChange={(e) => setBrandName(e.target.value)} className="h-8 text-xs font-semibold" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="headline" className="text-[10px] text-slate-400">Main Call-To-Action</Label>
                      <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="h-8 text-xs font-semibold" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="subtext" className="text-[10px] text-slate-400">Table Number / Label</Label>
                      <Input id="subtext" value={subtext} onChange={(e) => setSubtext(e.target.value)} className="h-8 text-xs font-semibold" />
                    </div>
                  </div>
                </div>

                {/* TOGGLES */}
                <div className="space-y-2 pt-2 border-t">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visibility Toggles</Label>
                  
                  {restaurant.wifi_password && (
                    <div className="flex items-center justify-between text-xs py-1 hover:bg-slate-50 px-2 rounded-md transition-colors">
                      <label htmlFor="showWifi" className="font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                        <Wifi className="h-3.5 w-3.5 text-slate-400" /> Print Guest WiFi Details
                      </label>
                      <input
                        type="checkbox"
                        id="showWifi"
                        checked={showWifi}
                        onChange={(e) => setShowWifi(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5 pt-2">
                    <Label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-slate-400" /> Card Logo
                    </Label>
                    <ImageUploader 
                      value={customLogoUrl} 
                      onChange={setCustomLogoUrl} 
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t shrink-0">
                <Button variant="outline" size="sm" className="h-10 font-bold" onClick={handlePrint} disabled={isDownloading}>
                  <Printer className="mr-1.5 h-4 w-4" />
                  Print Card
                </Button>
                <Button size="sm" className="h-10 font-bold" onClick={handleDownloadPng} disabled={isDownloading}>
                  <Download className="mr-1.5 h-4 w-4" />
                  {isDownloading ? "Generating..." : "Download PNG"}
                </Button>
              </div>
            </div>

          </div>
        </div>
      , document.body)}
    </>
  );
}
