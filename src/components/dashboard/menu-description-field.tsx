"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MenuDescriptionField() {
  const [desc, setDesc] = useState("");
  const placeholder = "Served from 11 AM to 4 PM. French classics and seasonal specialties.";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="description">Description</Label>
        <button
          type="button"
          onClick={() => setDesc(placeholder)}
          className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
        >
          Autofill Example
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
