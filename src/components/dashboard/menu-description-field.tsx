"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";

export function MenuDescriptionField() {
  const [desc, setDesc] = useState("");
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const placeholder = "Served from 11 AM to 4 PM. French classics and seasonal specialties.";

  const handleGenerateDescription = async () => {
    // Get the menu name from the parent form input
    const nameInput = document.getElementById("name") as HTMLInputElement | null;
    const name = nameInput?.value;
    
    if (!name) {
      alert("Please enter a Menu Name first!");
      return;
    }
    
    setIsGeneratingDesc(true);
    try {
      const res = await fetch("/api/menu/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: 'menu' })
      });
      const data = await res.json();
      if (data.description) {
        setDesc(data.description);
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="description">Description</Label>
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={isGeneratingDesc}
          className="text-[10px] text-purple-600 hover:text-purple-700 hover:underline font-bold uppercase tracking-wider flex items-center gap-1 disabled:opacity-50"
        >
          {isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          AI Writer
        </button>
      </div>
      <Textarea
        id="description"
        name="description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder={`e.g. ${placeholder}`}
      />
    </div>
  );
}
