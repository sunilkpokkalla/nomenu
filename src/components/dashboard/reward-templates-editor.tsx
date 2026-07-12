"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, Wand2, Loader2 } from "lucide-react";
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

  const generateTenStepJourney = () => {
    const journey: RewardTemplate[] = [
      { label: "Free Appetizer", value: "Congratulations on your first 10 stamps! Claim a free appetizer of your choice." },
      { label: "Free Dessert", value: "You hit 20 stamps! Celebrate with any free dessert." },
      { label: "BOGO Entree", value: "30 stamps! Buy one entree, get one free on your next visit." },
      { label: "Free Drink", value: "40 stamps! Any beverage is on the house today." },
      { label: "15% Off Total", value: "Halfway to the mega reward! Enjoy 15% off your entire bill today." },
      { label: "Free Premium Side", value: "60 stamps! Upgrade your meal with a free premium side." },
      { label: "Free Signature Drink", value: "70 stamps! Try our signature cocktail or mocktail for free." },
      { label: "Free Kids Meal", value: "80 stamps! Bring the family and get a free kids meal." },
      { label: "25% Off Total", value: "90 stamps! Enjoy 25% off your entire order today." },
      { label: "Mega Reward Next!", value: "100 stamps! You've unlocked the 100-visit milestone!" }
    ];
    setTemplates(journey);
  };

  const [generatingStates, setGeneratingStates] = useState<Record<number, boolean>>({});

  const handleGenerate = async (index: number) => {
    const label = templates[index].label;
    if (!label.trim()) return;

    setGeneratingStates(prev => ({ ...prev, [index]: true }));
    try {
      const res = await fetch("/api/menu/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: label, type: "reward" }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.description) {
          updateTemplate(index, "value", data.description);
        }
      }
    } catch (error) {
      console.error("Failed to generate reward description:", error);
    } finally {
      setGeneratingStates(prev => ({ ...prev, [index]: false }));
    }
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
          <div className="flex gap-2 justify-center">
            <Button type="button" variant="outline" onClick={addTemplate} className="gap-2">
              <Plus className="w-4 h-4" /> Add 10-Stamp Reward
            </Button>
            <Button type="button" onClick={generateTenStepJourney} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Wand2 className="w-4 h-4" /> Quick Setup 10-Step Journey
            </Button>
          </div>
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
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-xs text-slate-500">Reward Message / Details</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50 -mr-2"
                      onClick={() => handleGenerate(index)}
                      disabled={generatingStates[index] || !template.label.trim()}
                    >
                      {generatingStates[index] ? (
                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3 h-3 mr-1.5" />
                      )}
                      AI Write
                    </Button>
                  </div>
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
          <div className="flex gap-2 mt-2">
            <Button type="button" variant="outline" onClick={addTemplate} className="flex-1 border-dashed gap-2 text-slate-500 bg-transparent">
              <Plus className="w-4 h-4" /> Add Reward Tier
            </Button>
            {templates.length < 10 && (
              <Button type="button" variant="secondary" onClick={generateTenStepJourney} className="flex-1 gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                <Wand2 className="w-4 h-4" /> Auto-fill 10 Tiers
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
