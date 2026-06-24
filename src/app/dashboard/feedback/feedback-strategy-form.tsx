"use client";

import { useState } from "react";
import { Save, Globe, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateFeedbackStrategy, generateRecoveryStrategy } from "./actions";

interface FeedbackStrategyFormProps {
  initialLoyaltyPin: string;
  initialRecoveryOffer: string;
  initialRecoveryMessage: string;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OFFER_PRESETS = [
  "15% off your next visit with code MAKEITRIGHT15",
  "A complimentary dessert or a signature non-alcoholic beverage on your next visit.",
  "Free appetizer on your next order.",
  ""
];

const MESSAGE_PRESETS = [
  "Thank you. Our manager has been notified and will reach out to you at {contact} to apologize personally.",
  "We sincerely apologize that your recent visit fell short of expectations. A manager will contact you at {contact} to make it right.",
  "We appreciate your honest feedback. Our team is reviewing it and will contact you at {contact}."
];

export function FeedbackStrategyForm({
  initialLoyaltyPin,
  initialRecoveryOffer,
  initialRecoveryMessage,
}: FeedbackStrategyFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recoveryOffer, setRecoveryOffer] = useState(initialRecoveryOffer);
  const [recoveryMessage, setRecoveryMessage] = useState(initialRecoveryMessage);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateRecoveryStrategy();
      if ("success" in result && result.success && result.offer && result.message) {
        setRecoveryOffer(result.offer);
        setRecoveryMessage(result.message);
      } else {
        alert(result.error || "Failed to generate strategy");
      }
    } catch (e) {
      alert("An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Strategy Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure your feedback strategies to convert angry customers into regulars, and turn regulars into promoters.
        </p>
      </div>

      <form action={updateFeedbackStrategy} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Loyalty Program (4-5 Stars)
          </h3>
          <div className="space-y-2">
            <Label htmlFor="loyaltyPin">Staff Stamp PIN (4 Digits)</Label>
            <Input 
              id="loyaltyPin" 
              name="loyaltyPin" 
              type="text" 
              maxLength={4}
              pattern="\d{4}"
              defaultValue={initialLoyaltyPin || "1234"} 
              placeholder="e.g. 1234" 
              className="max-w-xs"
            />
            <p className="text-[10px] text-muted-foreground">Used by staff to stamp a customer's digital 5-star loyalty card.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Service Recovery (1-3 Stars)
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200 shrink-0"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Generate with AI
            </Button>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="recoveryOfferText">Apology Offer (Optional)</Label>
                <Select onValueChange={(val) => setRecoveryOffer(val === "none" ? "" : val)}>
                  <SelectTrigger className="h-6 w-[120px] text-[10px] px-2 py-0 border-slate-200">
                    <SelectValue placeholder="Use preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFER_PRESETS.map((preset, idx) => (
                      <SelectItem key={idx} value={preset || "none"} className="text-[11px]">
                        {preset ? `Preset ${idx + 1}` : "No offer"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea 
                id="recoveryOfferText" 
                name="recoveryOfferText" 
                value={recoveryOffer}
                onChange={(e) => setRecoveryOffer(e.target.value)}
                placeholder="e.g. 15% off your next visit with code MAKEITRIGHT15"
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="recoveryMessage">Follow-up Message</Label>
                <Select onValueChange={(val) => setRecoveryMessage(val)}>
                  <SelectTrigger className="h-6 w-[120px] text-[10px] px-2 py-0 border-slate-200">
                    <SelectValue placeholder="Use preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MESSAGE_PRESETS.map((preset, idx) => (
                      <SelectItem key={idx} value={preset} className="text-[11px]">
                        Preset {idx + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea 
                id="recoveryMessage" 
                name="recoveryMessage" 
                value={recoveryMessage}
                onChange={(e) => setRecoveryMessage(e.target.value)}
                placeholder="Thank you. Our manager has been notified and will reach out to you at {contact} to apologize personally."
                rows={4}
                className="resize-none"
              />
              <p className="text-[10px] text-muted-foreground mt-auto pt-1">Use {'{contact}'} as a placeholder for their email/phone.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Save Strategy
          </Button>
        </div>
      </form>
    </div>
  );
}
