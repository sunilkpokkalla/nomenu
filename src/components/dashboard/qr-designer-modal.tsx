"use client";

import { X, Printer, Download, Sparkles, Palette, Wifi, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toPng } from "html-to-image";
import { TEMPLATES, TEMPLATE_OPTIONS, TemplateKey } from "./qr-templates";
import Image from "next/image";

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
}

const PRESETS = [
  { name: "Brand Colors", type: "brand" },
  { name: "Sunset Flare", type: "sunset", start: "#F59E0B", end: "#EF4444" },
  { name: "Midnight Forest", type: "midnight", start: "#0F766E", end: "#1E293B" },
  { name: "Ocean Breeze", type: "ocean", start: "#06B6D4", end: "#3B82F6" },
  { name: "Luxury Gold", type: "gold", start: "#111827", end: "#B45309" },
  { name: "Custom", type: "custom" },
];

export function QrDesignerModal({ qr, restaurant, qrImageApiUrl }: QRDesignerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [template, setTemplate] = useState<TemplateKey>("portrait");
  const [colorPreset, setColorPreset] = useState("brand");
  
  // Custom brand settings
  const [brandName, setBrandName] = useState(restaurant.name);
  const [headline, setHeadline] = useState("Scan to View Menu");
  const [subtext, setSubtext] = useState(qr.label || "Table");
  const [showWifi, setShowWifi] = useState(!!restaurant.wifi_password);
  const [showLogo, setShowLogo] = useState(true);

  // Gradient custom pickers
  const [customStart, setCustomStart] = useState(restaurant.primary_color || "#2563EB");
  const [customEnd, setCustomEnd] = useState(restaurant.accent_color || "#F59E0B");

  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Get active colors
  const getGradientColors = () => {
    switch (colorPreset) {
      case "sunset":
        return { start: "#F59E0B", end: "#EF4444" };
      case "midnight":
        return { start: "#0F766E", end: "#1E293B" };
      case "ocean":
        return { start: "#06B6D4", end: "#3B82F6" };
      case "gold":
        return { start: "#1F2937", end: "#D97706" };
      case "custom":
        return { start: customStart, end: customEnd };
      case "brand":
      default:
        return {
          start: restaurant.primary_color || "#2563EB",
          end: restaurant.accent_color || "#F59E0B",
        };
    }
  };

  const { start: colorStart, end: colorEnd } = getGradientColors();

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

  const SelectedTemplate = TEMPLATES[template];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex-1 bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white"
      >
        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
        Design Card
      </Button>

      {isOpen && (
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
                    logoUrl={showLogo ? restaurant.logo_url : null}
                    qrImageUrl={qrImageApiUrl}
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
                  <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto p-1">
                    {TEMPLATE_OPTIONS.map((t) => {
                      const isFreePlan = !restaurant.plan || restaurant.plan.toLowerCase() === "free";
                      const isLocked = isFreePlan && t.id !== "portrait";

                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            if (!isLocked) setTemplate(t.id);
                          }}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all flex flex-col relative ${
                            template === t.id
                              ? "border-primary bg-primary/5 text-primary shadow-sm"
                              : isLocked
                              ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                              : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <span className="truncate">{t.name}</span>
                          {isLocked && (
                            <span className="absolute right-2 top-2 text-[8px] bg-slate-200 text-slate-500 px-1 rounded uppercase font-bold">PRO</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {(!restaurant.plan || restaurant.plan.toLowerCase() === "free") && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <p className="text-[10px] text-amber-800 font-medium text-center">
                        Upgrade to Growth to unlock premium card designs.
                      </p>
                    </div>
                  )}
                </div>

                {/* COLOR PRESETS */}
                {template !== "minimalist" && template !== "polaroid" && template !== "bistrogold" && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color Theme Preset</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setColorPreset(preset.type)}
                          className={`px-2 py-1.5 text-[10px] font-bold rounded-md border text-center transition-all ${
                            colorPreset === preset.type
                              ? "border-slate-800 bg-slate-900 text-white shadow-sm"
                              : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>

                    {/* Custom Picker Fields */}
                    {colorPreset === "custom" && (
                      <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t">
                        <div className="space-y-1">
                          <Label htmlFor="customStart" className="text-[10px] text-slate-400">Gradient Start</Label>
                          <div className="flex gap-1.5 items-center">
                            <input
                              type="color"
                              id="customStart"
                              value={customStart}
                              onChange={(e) => setCustomStart(e.target.value)}
                              className="h-7 w-7 rounded-md cursor-pointer border p-0 overflow-hidden"
                            />
                            <span className="text-[10px] font-mono font-semibold">{customStart}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="customEnd" className="text-[10px] text-slate-400">Gradient End</Label>
                          <div className="flex gap-1.5 items-center">
                            <input
                              type="color"
                              id="customEnd"
                              value={customEnd}
                              onChange={(e) => setCustomEnd(e.target.value)}
                              className="h-7 w-7 rounded-md cursor-pointer border p-0 overflow-hidden"
                            />
                            <span className="text-[10px] font-mono font-semibold">{customEnd}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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

                  {restaurant.logo_url && (
                    <div className="flex items-center justify-between text-xs py-1 hover:bg-slate-50 px-2 rounded-md transition-colors">
                      <label htmlFor="showLogo" className="font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                        <ImageIcon className="h-3.5 w-3.5 text-slate-400" /> Display Restaurant Logo
                      </label>
                      <input
                        type="checkbox"
                        id="showLogo"
                        checked={showLogo}
                        onChange={(e) => setShowLogo(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </div>
                  )}
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
      )}
    </>
  );
}
