"use client";

import { useState, useEffect, useCallback } from "react";
import { CopyButton, DownloadButton } from "@/components/dashboard/qr-actions";
import { QrDesignerModal } from "@/components/dashboard/qr-designer-modal";
import { DeleteConfirmForm } from "@/components/dashboard/delete-confirm";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Printer, Trash2 } from "lucide-react";
import { deleteQrCode, bulkDeleteQrCodes } from "@/app/dashboard/actions";
import { BatchQrDesignerModal } from "@/components/dashboard/batch-qr-designer-modal";
import { QRCodeSVG } from "qrcode.react";

const getGridClass = (count: number) => {
  if (count <= 2) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  if (count <= 4) return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";
};

// Types extracted from page
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QrCode = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Menu = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Restaurant = any;

export function QrCodesClient({
  qrCodesList,
  menusList,
  restaurant,
  baseUrl,
  rootDomain,
  getLocationIconStr
}: {
  qrCodesList: QrCode[];
  menusList: Menu[];
  restaurant: Restaurant;
  baseUrl: string;
  rootDomain: string;
  getLocationIconStr: string;
}) {
  const [selectedQrIds, setSelectedQrIds] = useState<Set<string>>(new Set());

  const toggleQrSelection = (id: string) => {
    const newSet = new Set(selectedQrIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedQrIds(newSet);
  };

  const toggleZoneSelection = (zoneQrs: QrCode[]) => {
    const allSelected = zoneQrs.every((qr) => selectedQrIds.has(qr.id));
    const newSet = new Set(selectedQrIds);
    
    if (allSelected) {
      zoneQrs.forEach((qr) => newSet.delete(qr.id));
    } else {
      zoneQrs.forEach((qr) => newSet.add(qr.id));
    }
    setSelectedQrIds(newSet);
  };

  const [savedColors, setSavedColors] = useState<Record<string, string>>({});

  const loadSavedColors = useCallback(() => {
    if (typeof window !== "undefined" && restaurant?.name && menusList) {
      const newSavedColors: Record<string, string> = {};
      menusList.forEach((menu: Menu) => {
        try {
          const savedStr = localStorage.getItem(`qr_design_${restaurant.name}_${menu.id}`);
          if (savedStr) {
            const parsed = JSON.parse(savedStr);
            if (parsed.qrColor) {
              newSavedColors[menu.id] = parsed.qrColor;
            }
          }
        } catch (e) {
          // ignore
        }
      });
      setSavedColors(newSavedColors);
    }
  }, [restaurant?.name, menusList]);

  useEffect(() => {
    loadSavedColors();
    window.addEventListener('qr_design_saved', loadSavedColors);
    return () => window.removeEventListener('qr_design_saved', loadSavedColors);
  }, [loadSavedColors]);

  const groupedQrs = qrCodesList.reduce((acc: Record<string, QrCode[]>, qr: QrCode) => {
    let locationType = qr.location_zone || "Main Dining";
    if (qr.mode === "pickup") locationType = "Takeaway";
    if (qr.mode === "reserve") locationType = "Priority Reserve";
    if (!acc[locationType]) acc[locationType] = [];
    acc[locationType].push(qr);
    return acc;
  }, {} as Record<string, typeof qrCodesList>);

  const selectedQrs = qrCodesList.filter(qr => selectedQrIds.has(qr.id));

  // Recreate the getLocationIcon logic slightly differently on client
  // Passing component via props is tough, so we'll just import them or let the server pass string identifiers.
  // Actually, we can just use a helper function here.
  const getLocationIcon = (format: string) => {
    // We'll import these dynamically or just use a standard icon if needed.
    // For simplicity, we can pass the JSX from the server, but server components passing JSX to client arrays is fine.
    // Let's implement this properly.
    return null; // Will fix shortly
  };

  return (
    <>
      <div className="space-y-16 pb-24">
        {qrCodesList.length > 0 ? (
          Object.entries(groupedQrs).map(([locationType, qrs]) => {
            const allSelected = qrs.every((qr: QrCode) => selectedQrIds.has(qr.id));
            const someSelected = qrs.some((qr: QrCode) => selectedQrIds.has(qr.id)) && !allSelected;

            return (
              <div key={locationType} className="space-y-8">
                <div className="flex items-center gap-4">
                  <Checkbox 
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={() => toggleZoneSelection(qrs)}
                    className="w-5 h-5"
                  />
                  <h3 className="text-3xl font-serif tracking-tight text-slate-900">{locationType}</h3>
                  <div className="h-[1px] bg-gradient-to-r from-slate-200 to-transparent flex-1 mt-2" />
                </div>
                
                <div className={`grid gap-4 sm:gap-6 ${getGridClass(qrs.length)}`}>
                  {qrs.map((qr: QrCode) => {
                    const targetMenu = menusList.find((m: Menu) => m.id === qr.menu_id);
                    
                    let publicUrl = `${baseUrl}/menu/${qr.menu_id}?qr=${qr.id}`;
                    const modeParam = qr.mode && qr.mode !== 'dine_in' ? `&mode=${qr.mode}` : '';
                    if (restaurant.slug && targetMenu?.slug) {
                      publicUrl = `${baseUrl}/${restaurant.slug}/${targetMenu.slug}?qr=${qr.id}${modeParam}`;
                    } else {
                      publicUrl += modeParam;
                    }
                    
                    let qrImageApiUrl = `/api/qr?data=${encodeURIComponent(publicUrl)}`;
                    
                    const design = (qr.design_metadata as Record<string, unknown>) || {};
                    const parsedColor = (design.qrColor as string) || savedColors[qr.menu_id];
                    
                    if (parsedColor && parsedColor !== "#0F172A") {
                      qrImageApiUrl += `&color=${encodeURIComponent(parsedColor)}`;
                    }
                    const isSelected = selectedQrIds.has(qr.id);
                    
                    return (
                      <div 
                        key={qr.id} 
                        className={`group relative flex flex-col bg-white/40 backdrop-blur-md border shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-white/60 ring-1 ring-slate-900/5'}`}
                      >
                        <div className="absolute top-4 left-4 z-20">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleQrSelection(qr.id)}
                            className="bg-white/80 backdrop-blur"
                          />
                        </div>

                        <div className={`flex flex-col items-center text-center ${qrs.length >= 5 ? 'pt-6 pb-3 px-4' : 'pt-8 pb-4 px-6'} relative z-10`}>
                          <h3 className={`${qrs.length >= 5 ? 'text-xl' : 'text-2xl'} font-bold tracking-tight text-slate-900`}>{qr.label}</h3>
                          <p className="text-sm text-slate-500 font-medium mt-1">
                            {targetMenu ? targetMenu.name : "Unknown Menu"}
                          </p>
                          {qr.mode && qr.mode !== 'dine_in' && (
                             <span className={`mt-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${qr.mode === 'pickup' ? 'bg-orange-50 text-orange-700 ring-orange-600/20' : 'bg-purple-50 text-purple-700 ring-purple-600/20'}`}>
                                {qr.mode === 'pickup' ? 'Takeaway' : 'Reserve'}
                             </span>
                          )}
                          <span className="mt-3 inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 tracking-wide uppercase">
                            {qr.scan_count || 0} scans
                          </span>
                        </div>

                        <div className="px-6 py-4 relative z-10">
                          <a
                            href={qrImageApiUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`block aspect-square w-full ${qrs.length >= 5 ? 'max-w-[9rem]' : 'max-w-[11rem]'} mx-auto rounded-2xl bg-white p-3 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer`}
                            title="Click to open full size QR image"
                          >
                            <QRCodeSVG 
                              value={publicUrl} 
                              size={256}
                              level="H"
                              marginSize={1}
                              fgColor={parsedColor && parsedColor !== "#0F172A" ? parsedColor : "#0F172A"}
                              className="w-full h-full object-contain mix-blend-multiply" 
                            />
                          </a>
                        </div>

                        {/* Unified Hovering Action Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                          <div className="flex items-center justify-center gap-1 bg-white/90 backdrop-blur-md shadow-xl ring-1 ring-black/5 rounded-full px-3 py-2 mx-4">
                            <CopyButton text={publicUrl} iconOnly />
                            <DownloadButton qrImageUrl={qrImageApiUrl} label={qr.label || "QR Code"} iconOnly />
                            <QrDesignerModal 
                              qr={{
                                id: qr.id,
                                label: `${qr.location_zone || "Main Dining"} • ${qr.label}`,
                                scan_count: qr.scan_count || 0,
                                menu_id: qr.menu_id,
                                mode: qr.mode,
                              }} 
                              restaurant={restaurant} 
                              qrImageApiUrl={qrImageApiUrl} 
                              iconOnly 
                            />
                            <div className="w-px h-4 bg-slate-200 mx-2" />
                            <DeleteConfirmForm
                              action={deleteQrCode}
                              confirmMessage={`Are you sure you want to delete QR code for "${qr.label}"?`}
                              name="qrCodeId"
                              value={qr.id}
                            >
                              <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                title="Delete QR Code"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DeleteConfirmForm>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Printer className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">No QR codes yet</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
              Create your first QR code to give customers instant access to your digital menu.
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedQrIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-8 border border-white/10">
          <span className="font-semibold">{selectedQrIds.size} QR Codes Selected</span>
          <div className="h-6 w-px bg-slate-700" />
          <BatchQrDesignerModal 
            selectedQrs={selectedQrs}
            restaurant={restaurant}
            baseUrl={baseUrl}
            rootDomain={rootDomain}
          />
          <DeleteConfirmForm
            action={bulkDeleteQrCodes}
            confirmMessage={`Are you sure you want to delete ${selectedQrIds.size} QR codes? This action cannot be undone.`}
            name="qrCodeIds"
            value={JSON.stringify(Array.from(selectedQrIds))}
          >
            <Button
              type="submit"
              variant="destructive"
              className="rounded-full bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </DeleteConfirmForm>
        </div>
      )}
    </>
  );
}
