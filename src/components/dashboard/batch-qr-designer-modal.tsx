"use client";

import { X, Printer, Download, Sparkles, Palette, Wifi, Image as ImageIcon, ChevronDown, Loader2 } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { templates, templateCategories, type TemplateKey } from "./qr-templates/index";
import Image from "next/image";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface BatchQRDesignerModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedQrs: any[];
  restaurant: {
    name: string;
    primary_color: string | null;
    accent_color: string | null;
    wifi_password: string | null;
    logo_url?: string | null;
    plan?: string | null;
    slug?: string | null;
  };
  baseUrl: string;
  rootDomain: string;
}

export function BatchQrDesignerModal({ selectedQrs, restaurant, baseUrl, rootDomain }: BatchQRDesignerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [template, setTemplate] = useState<TemplateKey>("classic");
  
  // Custom brand settings
  const [brandName, setBrandName] = useState(restaurant.name || "");
  const [headline, setHeadline] = useState("Scan to View Menu");
  const [showWifi, setShowWifi] = useState(!!restaurant.wifi_password);
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(restaurant.logo_url || "");

  const printRef = useRef<HTMLDivElement>(null);

  const colorStart = restaurant.primary_color || "#2563EB";
  const colorEnd = restaurant.accent_color || "#F59E0B";

  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadZip = useCallback(async () => {
    if (printRef.current === null || isGenerating) return;
    setIsGenerating(true);

    try {
      const zip = new JSZip();
      
      // The hidden wrapper contains all the cards
      const children = Array.from(printRef.current.children) as HTMLElement[];
      
      for (let i = 0; i < children.length; i++) {
        const node = children[i];
        const qr = selectedQrs[i];
        
        // Use html-to-image to generate the PNG
        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio: 2, // High-quality print
          skipFonts: false,
          style: {
            transform: "scale(1)",
            transformOrigin: "top left",
          }
        });
        
        // Remove the data:image/png;base64, prefix
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        
        // Ensure clean filenames
        const label = qr.label ? qr.label.replace(/[^a-z0-9]/gi, '_').toLowerCase() : `code_${i+1}`;
        zip.file(`${restaurant.name.replace(/[^a-z0-9]/gi, '_')}_${label}.png`, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${restaurant.name.replace(/[^a-z0-9]/gi, '_')}_QRs.zip`);
      
    } catch (err) {
      console.error("Failed to generate ZIP", err);
      alert("Failed to generate ZIP. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [restaurant.name, selectedQrs, isGenerating]);

  if (!mounted) return null;

  // Grab the first QR code to show as the live preview
  const previewQr = selectedQrs[0];
  if (!previewQr) return null;

  const plan = restaurant.plan?.toLowerCase() || 'free';
  const domainPrefix = ['elite', 'enterprise'].includes(plan) ? 'order' : 'menu';
  let previewPublicUrl = `${baseUrl}/menu/${previewQr.menu_id}?qr=${previewQr.id}`;
  if (restaurant.slug) { // Mock the URL since we don't have menu slug easily here, or just use the generic one for the QR image
    previewPublicUrl = `${baseUrl}/menu/${previewQr.menu_id}?qr=${previewQr.id}`;
  }
  const primaryColor = restaurant.primary_color || "#0F172A";
  const previewQrImageApiUrl = `/api/qr?data=${encodeURIComponent(previewPublicUrl)}&color=${encodeURIComponent(primaryColor)}`;

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-white text-slate-900 hover:bg-slate-100 rounded-full font-bold px-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Customize & Print Batch
      </Button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/20 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            
            {/* LEFT SIDE: PREVIEW CONTAINER */}
            <div className="flex-1 bg-gradient-to-br from-slate-100 via-indigo-50/60 to-purple-50/40 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/50 overflow-y-auto min-h-[460px] md:min-h-0 relative">
              <div className="mb-4 text-center absolute top-6 flex flex-col items-center">
                <span className="text-[11px] uppercase font-black tracking-[0.2em] text-indigo-400 drop-shadow-sm flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-3.5 h-3.5" /> Live Preview
                </span>
                <p className="text-slate-500 font-medium text-xs mt-1.5 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/50">
                  Previewing 1 of {selectedQrs.length} QR codes
                </p>
              </div>
              
              {/* Scaled wrapper for preview so it fits nicely on smaller screens */}
              <div className="transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] origin-center mt-12 relative flex items-center justify-center">
                
                {/* Floating Glow behind card */}
                <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full scale-90 translate-y-4 pointer-events-none" />
                
                {/* The card itself */}
                <div className="relative shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden transition-all duration-500 flex items-center justify-center bg-white">
                  {(() => {
                    const TemplateComponent = templates[template] || templates["classic"];
                    return (
                      <TemplateComponent 
                        brandName={brandName}
                        headline={headline}
                        subtext={previewQr.label || "Table"}
                        qrImageUrl={previewQrImageApiUrl}
                        colorStart={colorStart}
                        colorEnd={colorEnd}
                        wifiPassword={showWifi ? (restaurant.wifi_password || "") : null}
                        logoUrl={customLogoUrl}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: CONTROLS */}
            <div className="w-full md:w-[450px] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none bg-white">
              <div className="space-y-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-950 flex items-center gap-2 tracking-tight">
                    <Palette className="h-5 w-5 text-indigo-600" />
                    Batch QR Designer
                  </h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <hr className="border-slate-100" />

                {/* TEMPLATE PICKER */}
                <div className="space-y-2.5">
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
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* CONTENT EDITORS */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" /> Custom Content
                  </Label>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="brandName" className="text-xs font-semibold text-slate-700">Brand Name</Label>
                      <Input 
                        id="brandName" 
                        value={brandName} 
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Your Restaurant"
                        className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 h-10 font-medium rounded-xl"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="headline" className="text-xs font-semibold text-slate-700">Headline</Label>
                      <Input 
                        id="headline" 
                        value={headline} 
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="Scan to View Menu"
                        className="bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 h-10 font-medium rounded-xl"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                        The subtext area will be automatically populated with the unique label of each individual QR code (e.g. Table 1, Bar 4) during the batch download.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-700">Custom Logo (Optional)</Label>
                      <ImageUploader folder="logo" hideLibrary={true}
                        value={customLogoUrl}
                        onChange={setCustomLogoUrl}
                      />
                      <p className="text-[11px] font-medium text-slate-500">Upload a logo to replace the default icon.</p>
                    </div>

                    {restaurant.wifi_password && (
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-3.5">
                          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                            <Wifi className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">Guest Wi-Fi</div>
                            <div className="text-[11px] font-medium text-slate-500">Include your network password</div>
                          </div>
                        </div>
                        <input 
                          type="checkbox"
                          checked={showWifi}
                          onChange={(e) => setShowWifi(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <Button 
                  onClick={handleDownloadZip}
                  disabled={isGenerating}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold h-12 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Generating PNGs...</>
                  ) : (
                    <><Download className="h-5 w-5" /> Download Group PNGs</>
                  )}
                </Button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Off-screen container to render ALL selected QR codes for image generation */}
      <div className="fixed top-[-9999px] left-[-9999px] opacity-100 pointer-events-none">
        <div ref={printRef} className="w-full flex flex-col gap-10">
          {selectedQrs.map((qr) => {
            const TemplateComponent = templates[template] || templates["classic"];
            const publicUrl = `${baseUrl}/menu/${qr.menu_id}?qr=${qr.id}`;
            const primaryColor = restaurant.primary_color || "#0F172A";
            const qrImageUrl = `/api/qr?data=${encodeURIComponent(publicUrl)}&color=${encodeURIComponent(primaryColor)}`;
            
            return (
              <div key={qr.id} className="qr-card-wrapper inline-block" style={{ width: 'fit-content' }}>
                <TemplateComponent 
                  brandName={brandName}
                  headline={headline}
                  subtext={qr.label || "Table"}
                  qrImageUrl={qrImageUrl}
                  colorStart={colorStart}
                  colorEnd={colorEnd}
                  wifiPassword={showWifi ? (restaurant.wifi_password || "") : null}
                  logoUrl={customLogoUrl}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
