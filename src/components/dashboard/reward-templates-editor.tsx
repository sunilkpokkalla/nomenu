"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface RewardTemplate {
  label: string;
  value: string;
}

interface RewardTemplatesEditorProps {
  initialTemplates?: RewardTemplate[] | null;
}

export function RewardTemplatesEditor({ initialTemplates }: RewardTemplatesEditorProps) {
  const [templates, setTemplates] = useState<RewardTemplate[]>(
    initialTemplates || []
  );

  const addTemplate = () => {
    setTemplates([...templates, { label: "", value: "" }]);
  };

  const removeTemplate = (index: number) => {
    setTemplates(templates.filter((_, i) => i !== index));
  };

  const updateTemplate = (index: number, field: keyof RewardTemplate, value: string) => {
    const newTemplates = [...templates];
    newTemplates[index][field] = value;
    setTemplates(newTemplates);
  };

  return (
    <div className="space-y-4">
      <input 
        type="hidden" 
        name="rewardTemplates" 
        value={JSON.stringify(templates.filter(t => t.label.trim() && t.value.trim()))} 
      />
      
      {templates.length === 0 ? (
        <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-slate-500 text-sm mb-4">
            You haven't defined a 10-stamp reward yet. Add one below to incentivize your customers!
          </p>
          <Button type="button" variant="outline" onClick={addTemplate} className="gap-2">
            <Plus className="w-4 h-4" /> Set 10-Stamp Reward
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((template, index) => (
            <div key={index} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-200 group">
              <div className="mt-2 text-slate-300">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <Label className="text-xs text-slate-500 mb-1.5 block">Reward Title (e.g., "Free Appetizer")</Label>
                  <Input 
                    placeholder="Short label..." 
                    value={template.label}
                    onChange={(e) => updateTemplate(index, "label", e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500 mb-1.5 block">Reward Message / Details</Label>
                  <Textarea 
                    placeholder="Congratulations on hitting 10 stamps! Show this message to claim your free appetizer."
                    value={template.value}
                    onChange={(e) => updateTemplate(index, "value", e.target.value)}
                    className="bg-white resize-none min-h-[80px]"
                  />
                </div>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeTemplate(index)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addTemplate} className="w-full mt-2 border-dashed gap-2 text-slate-500 bg-transparent">
            <Plus className="w-4 h-4" /> Add Alternate 10-Stamp Reward Choice
          </Button>
        </div>
      )}
    </div>
  );
}
