"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Link as LinkIcon, X, AlertCircle, Loader2, Image as ImageIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { createClient } from "@/lib/supabase/client";

import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  folder?: "logo" | "item-list" | "general";
  hideLibrary?: boolean;
}

export function ImageUploader({ value: externalValue, onChange, folder = "item-list", hideLibrary = false }: ImageUploaderProps) {
  const [mode, setMode] = useState<"file" | "stock">("file");
  const [internalValue, setInternalValue] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stockImages, setStockImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  // Load initial library images when switching to stock mode
  useEffect(() => {
    async function loadInitial() {
      if (mode === "stock" && stockImages.length === 0 && !searchQuery) {
        try {
          const res = await fetch('/api/library');
          const data = await res.json();
          if (res.ok && data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setStockImages(data.map((m: any) => ({
              id: m.id,
              url: m.image_url,
              thumb: m.image_url,
              alt: m.name,
              photographer: m.name
            })));
          }
        } catch (err) {
          console.error("Failed to load initial library:", err);
        }
      }
    }
    loadInitial();
  }, [mode, stockImages.length, searchQuery]);

  useEffect(() => {
    if (externalValue !== undefined) {
      setPreview(externalValue);
    }
  }, [externalValue]);

  const updateValue = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
    setPreview(newValue);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB for storage
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please choose a smaller image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);

    try {
      // Compress the image
      let compressedFile = file;
      try {
        const options = {
          maxSizeMB: 0.2, // Target under 200KB
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp" as string
        };
        compressedFile = await imageCompression(file, options);
      } catch (compressionError) {
        console.warn("Failed to compress image, falling back to original", compressionError);
      }

      const isCompressed = compressedFile !== file;
      const fileExt = isCompressed ? "webp" : file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const uploadFormData = new FormData();
      uploadFormData.append("file", compressedFile);
      uploadFormData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }
      
      updateValue(data.publicUrl);
    } catch (err: unknown) {
      console.error('Error uploading image:', err);
      setError((err as Error).message || "Failed to upload image. Make sure the storage bucket exists.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    updateValue("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStockSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError("");
    
    try {
      const res = await fetch(`/api/library?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to search library");
        
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStockImages((data || []).map((m: any) => ({
        id: m.id,
        url: m.image_url,
        thumb: m.image_url,
        alt: m.name,
        photographer: m.name
      })));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden input to submit the base64 or URL value with the parent form */}
      <input type="hidden" name="imageUrl" value={value} />

      {/* Tabs */}
      <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMode("file");
            handleRemove();
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mode === "file"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload File
        </button>

        {!hideLibrary && (
          <button
            type="button"
            onClick={() => {
              setMode("stock");
              handleRemove();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "stock"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Dish Library
          </button>
        )}
      </div>

      {/* Inputs */}
      {mode === "file" && (
        <div className="space-y-2">
          <div className="flex items-center justify-center w-full relative">
            {isUploading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 rounded-lg">
                <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                <p className="text-xs font-medium text-slate-700">Uploading to storage...</p>
              </div>
            )}
            <label className={`flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-slate-50 transition-colors border-2 border-dashed ${folder === 'logo' ? 'w-32 h-32 rounded-full mx-auto border-slate-300 shadow-sm' : 'w-full h-24 rounded-lg border-slate-200'}`}>
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Upload className={`${folder === 'logo' ? 'w-5 h-5 mb-2' : 'w-6 h-6 mb-1'} text-slate-400`} />
                {folder === 'logo' ? (
                  <p className="text-[10px] text-slate-500 font-semibold leading-tight">Upload Logo</p>
                ) : (
                  <>
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WebP (max 5MB)</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}


      {mode === "stock" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input 
              type="text" 
              placeholder="Search dishes (e.g. Burger, Pasta)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleStockSearch();
                }
              }}
              className="text-xs"
            />
            <Button type="button" size="sm" onClick={handleStockSearch} disabled={isSearching} className="shrink-0 bg-slate-900 text-white hover:bg-slate-800">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-1.5" /> Search</>}
            </Button>
          </div>
          {stockImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1.5 pr-2 rounded-xl bg-slate-50 border border-slate-100">
              {stockImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => updateValue(img.url)}
                  className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-indigo-500 hover:shadow-md transition-all group outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <img src={img.thumb} alt={img.alt || "Food"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-4 pb-1.5 px-2 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity truncate font-medium">
                    {img.photographer}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview box */}
      {preview && (
        <div className={`relative bg-white flex items-center ${folder === 'logo' ? 'flex-col gap-3 justify-center text-center p-4 rounded-xl border border-slate-100 shadow-sm' : 'flex-row gap-3 p-2 rounded-xl border border-slate-200'}`}>
          <div className={`${folder === 'logo' ? 'h-24 w-24 rounded-full shadow-md ring-4 ring-slate-50' : 'h-12 w-12 rounded-lg'} overflow-hidden border border-slate-100 shrink-0 bg-slate-50 relative flex items-center justify-center`}>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setError("Unable to load preview. Please verify URL.")}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">{folder === 'logo' ? 'Brand Logo Active' : 'Image Loaded'}</p>
            {folder !== 'logo' && <p className="text-[9px] text-slate-400 truncate max-w-[200px]">{value}</p>}
          </div>
          <Button
            type="button"
            variant={folder === 'logo' ? 'outline' : 'ghost'}
            size="sm"
            onClick={handleRemove}
            className={folder === 'logo' ? 'mt-2 h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50' : 'h-7 w-7 p-0 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer'}
          >
            {folder === 'logo' ? 'Remove Logo' : <X className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}

