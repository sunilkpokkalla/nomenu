"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { bulkInsertMenuData, createPremiumMagicImportJob } from "@/app/dashboard/menus/[id]/customize/actions";

interface MagicImportProps {
  menuId: string;
  restaurantId: string;
}

export function MagicImportModal({ menuId, restaurantId }: MagicImportProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [imageOption, setImageOption] = useState<"free" | "premium">("free");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const processWithAI = async () => {
    if (!file) return;
    setIsProcessingAI(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/menu/magic-import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process menu");
      }

      setPreviewData(data);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleConfirmAndSave = async () => {
    if (!previewData || !previewData.categories) return;
    setIsSaving(true);
    setError(null);

    try {
      if (imageOption === "free") {
        await bulkInsertMenuData(menuId, restaurantId, previewData);
        setOpen(false); // Close modal on success
        setFile(null);
        setPreviewData(null);
      } else {
        // Premium Option
        const res = await createPremiumMagicImportJob(menuId, restaurantId, previewData);
        if (res.jobId) {
          const checkoutRes = await fetch("/api/stripe/checkout-ai-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobId: res.jobId,
              returnUrl: window.location.href,
            })
          });
          const checkoutData = await checkoutRes.json();
          if (checkoutData.url) {
            window.location.href = checkoutData.url;
            return; // do not clear saving state because we are redirecting
          } else {
            throw new Error(checkoutData.error || "Failed to initiate checkout");
          }
        }
      }
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "Failed to process.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetFlow = () => {
    setFile(null);
    setPreviewData(null);
    setError(null);
  };

  const getTotalItems = () => {
    if (!previewData?.categories) return 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return previewData.categories.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-sm border-0 gap-2 font-semibold">
          <Sparkles className="h-4 w-4" />
          AI Magic Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl rounded-2xl top-[5vh] translate-y-0 mb-[5vh]">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <DialogTitle className="text-xl font-bold flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Magic Menu Import
            </div>
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm mt-1.5">
            Upload a picture or PDF of your physical menu, and Gemini AI will automatically digitize all categories, items, descriptions, and prices.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 bg-white">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 overflow-hidden">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="break-words break-all whitespace-pre-wrap">{error}</p>
            </div>
          )}

          {!previewData ? (
            // Upload State
            <div className="space-y-4">
              <div 
                onClick={() => !isProcessingAI && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isProcessingAI ? 'opacity-50 border-slate-200 bg-slate-50' : 'cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 border-slate-300'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
                
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                </div>
                
                {file ? (
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Click or drag file to upload</p>
                    <p className="text-sm text-slate-500">Supports PDF, JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>

              <Button 
                onClick={processWithAI}
                disabled={!file || isProcessingAI}
                className="w-full h-11 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50"
              >
                {isProcessingAI ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reading your menu...</>
                ) : "Process with Gemini AI"}
              </Button>
            </div>
          ) : (
            // Preview State
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-800">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-bold">Extraction Successful!</h4>
                  <p className="text-sm opacity-90">Found {previewData.categories?.length || 0} categories and {getTotalItems()} items.</p>
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {previewData.categories?.map((cat: any, i: number) => (
                  <div key={i} className="space-y-3">
                    <div>
                      <h5 className="font-bold text-slate-900">{cat.name}</h5>
                      {cat.description && <p className="text-xs text-slate-500">{cat.description}</p>}
                    </div>
                    <ul className="space-y-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {cat.items?.map((item: any, j: number) => (
                        <li key={j} className="bg-white p-3 rounded-lg border border-slate-100 flex justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                            {item.description && <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>}
                          </div>
                          <div className="text-sm font-bold text-slate-900 shrink-0">
                            ${item.price?.toFixed(2) || '0.00'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 text-sm">Image Generation Options</h4>
                <div className="grid gap-3">
                  <div 
                    onClick={() => setImageOption("free")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${imageOption === "free" ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-slate-900">🟢 Standard Library (Free)</p>
                      <p className="font-bold text-slate-900">$0.00</p>
                    </div>
                    <p className="text-xs text-slate-500">Automatically attaches matching high-quality stock photos from our curated library.</p>
                  </div>
                  
                  <div 
                    onClick={() => setImageOption("premium")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${imageOption === "premium" ? 'border-purple-600 bg-purple-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1">👑 Premium AI Photos</p>
                      <p className="font-bold text-purple-700">${((getTotalItems() * 30) / 100).toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-slate-500">Generate a unique, hyper-realistic HD photo for every single item using Google Imagen AI ($0.30 per item).</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={resetFlow} disabled={isSaving} className="flex-1 h-11 rounded-xl">
                  Upload Different File
                </Button>
                <Button onClick={handleConfirmAndSave} disabled={isSaving} className={`flex-1 h-11 text-white rounded-xl ${imageOption === 'premium' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isSaving ? "Processing..." : imageOption === "premium" ? `Pay $${((getTotalItems() * 30) / 100).toFixed(2)} & Import` : "Confirm & Import All"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
