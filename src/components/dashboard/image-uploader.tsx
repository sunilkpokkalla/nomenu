"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Link as LinkIcon, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function ImageUploader({ value: externalValue, onChange }: ImageUploaderProps) {
  const [mode, setMode] = useState<"file" | "url">("file");
  const [internalValue, setInternalValue] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  useEffect(() => {
    if (externalValue !== undefined) {
      setPreview(externalValue);
      // If external value is a URL, switch to URL mode
      if (externalValue && externalValue.startsWith("http")) {
        setMode("url");
      }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 2.5MB
    if (file.size > 2.5 * 1024 * 1024) {
      setError("File size exceeds 2.5MB limit. Please choose a smaller image.");
      updateValue("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateValue(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const url = e.target.value.trim();
    updateValue(url);
  };

  const handleRemove = () => {
    updateValue("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <Label>Item Image (Optional)</Label>
      
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
        <button
          type="button"
          onClick={() => {
            setMode("url");
            handleRemove();
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mode === "url"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          Image URL
        </button>
      </div>

      {/* Inputs */}
      {mode === "file" ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-4 pb-4">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <p className="text-xs text-slate-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WebP (max 2.5MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Input
            type="url"
            placeholder="e.g. https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            onChange={handleUrlChange}
            value={mode === "url" ? value : ""}
            className="text-xs"
          />
          <p className="text-[10px] text-slate-400">Paste any public web image address.</p>
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
        <div className="relative rounded-xl border border-slate-200 p-2 bg-white flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50 relative flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setError("Unable to load preview. Please verify URL.")}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Image Loaded</p>
            <p className="text-[9px] text-slate-400 truncate max-w-[200px]">{value}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-7 w-7 p-0 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

