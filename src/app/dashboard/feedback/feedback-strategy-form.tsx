"use client";

import { useState } from "react";
import { Save, Globe, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateFeedbackStrategy, generateRecoveryStrategy } from "./actions";

interface FeedbackStrategyFormProps {
  initialRecoveryOffer: string;
  initialRecoveryMessage: string;
  initialServiceRecoveryMessage: string;
  initialServiceRecoveryEnabled: boolean;
  initialOfferManagerVisit: boolean;
  initialOfferCompensation: boolean;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OFFER_PRESETS = [
  { label: "Immediate Resolution (Comp it now)", value: "Please keep this screen open and show it to your server so we can take care of it immediately." },
  { label: "Percentage Discount", value: "15% off your next visit with code MAKEITRIGHT15" },
  { label: "Complimentary Item", value: "A complimentary dessert or a signature non-alcoholic beverage on your next visit." },
  { label: "Free Appetizer", value: "Free appetizer on your next order." },
  { label: "No Offer (Message Only)", value: "" }
];

const MESSAGE_PRESETS = [
  { label: "Immediate Resolution", value: "That is completely unacceptable. We want to fix this right now." },
  { label: "Standard: Manager Reach Out", value: "Thank you. Our manager has been notified and will reach out to you at {contact} to apologize personally." },
  { label: "Formal: Make It Right", value: "We sincerely apologize that your recent visit fell short of expectations. A manager will contact you at {contact} to make it right." },
  { label: "Appreciative: Honest Feedback", value: "We appreciate your honest feedback. Our team is reviewing it and will contact you at {contact}." }
];

export function FeedbackStrategyForm({
  initialRecoveryOffer,
  initialRecoveryMessage,
  initialServiceRecoveryMessage,
  initialServiceRecoveryEnabled,
  initialOfferManagerVisit,
  initialOfferCompensation,
}: FeedbackStrategyFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recoveryOffer, setRecoveryOffer] = useState(initialRecoveryOffer);
  const [recoveryMessage, setRecoveryMessage] = useState(initialRecoveryMessage);
  const [serviceRecoveryMessage, setServiceRecoveryMessage] = useState(initialServiceRecoveryMessage);
  
  // Toggles state (used just for optimistic UI, but form submittals use hidden inputs or Switch names)
  const [serviceRecoveryEnabled, setServiceRecoveryEnabled] = useState(initialServiceRecoveryEnabled);
  const [offerManagerVisit, setOfferManagerVisit] = useState(initialOfferManagerVisit);
  const [offerCompensation, setOfferCompensation] = useState(initialOfferCompensation);

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
        <h2 className="text-xl font-bold text-slate-900">Service Recovery Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure your feedback strategies to convert angry customers into regulars, and turn regulars into promoters.
        </p>
      </div>

      <form action={updateFeedbackStrategy} className="space-y-8">
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 flex items-center justify-between bg-slate-50 border-b border-slate-100">
            <div>
              <Label className="text-base font-semibold text-slate-900">Enable Service Recovery Flow</Label>
              <p className="text-sm text-slate-500">Automatically offer unhappy customers options to resolve the issue before they leave.</p>
            </div>
            <Switch 
              name="serviceRecoveryEnabled"
              checked={serviceRecoveryEnabled}
              onCheckedChange={setServiceRecoveryEnabled}
            />
          </div>
          
          <div className={`transition-all duration-300 ease-in-out ${serviceRecoveryEnabled ? "opacity-100 max-h-[1000px] p-5" : "opacity-50 max-h-0 overflow-hidden p-0 m-0 border-0"}`}>
            
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div>
                    <Label className="text-sm font-semibold text-slate-900">Offer "Speak to Manager"</Label>
                    <p className="text-xs text-slate-500 mt-0.5">Allow the customer to instantly alert a manager to their table.</p>
                 </div>
                 <Switch 
                    name="offerManagerVisit"
                    checked={offerManagerVisit}
                    onCheckedChange={setOfferManagerVisit}
                    disabled={!serviceRecoveryEnabled}
                  />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                 <div>
                    <Label className="text-sm font-semibold text-slate-900">Offer "Compensation"</Label>
                    <p className="text-xs text-slate-500 mt-0.5">Let customers request a free item or service (instead of a refund).</p>
                 </div>
                 <Switch 
                    name="offerCompensation"
                    checked={offerCompensation}
                    onCheckedChange={setOfferCompensation}
                    disabled={!serviceRecoveryEnabled}
                  />
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Service Recovery Messaging
                </h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200 shrink-0"
                  onClick={handleGenerate}
                  disabled={isGenerating || !serviceRecoveryEnabled}
                >
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate with AI
                </Button>
              </div>
          
          <div className="grid gap-6">
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="serviceRecoveryMessage">Initial Apology Message</Label>
              </div>
              <Textarea 
                id="serviceRecoveryMessage" 
                name="serviceRecoveryMessage" 
                value={serviceRecoveryMessage}
                onChange={(e) => setServiceRecoveryMessage(e.target.value)}
                placeholder="We are so sorry your experience wasn't perfect. Our manager has been alerted and is looking into this immediately. In case we miss you before you leave, please let us know how we can make this right:"
                rows={3}
                className="resize-none"
              />
              <p className="text-[10px] text-muted-foreground mt-auto pt-1">Shown immediately when a customer leaves a 1-3 star review.</p>
            </div>

            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="recoveryOfferText">Apology Offer (Optional)</Label>
                <Select onValueChange={(val) => setRecoveryOffer(val === "none" ? "" : val)}>
                  <SelectTrigger className="h-6 w-[160px] text-[10px] px-2 py-0 border-slate-200">
                    <SelectValue placeholder="Use preset..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 border-slate-200 shadow-md">
                    {OFFER_PRESETS.map((preset, idx) => (
                      <SelectItem key={idx} value={preset.value || "none"} className="text-[11px]">
                        {preset.label}
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
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="recoveryMessage">Follow-up Message</Label>
                <Select onValueChange={(val) => setRecoveryMessage(val)}>
                  <SelectTrigger className="h-6 w-[160px] text-[10px] px-2 py-0 border-slate-200">
                    <SelectValue placeholder="Use preset..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 border-slate-200 shadow-md">
                    {MESSAGE_PRESETS.map((preset, idx) => (
                      <SelectItem key={idx} value={preset.value} className="text-[11px]">
                        {preset.label}
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
                placeholder="Thank you for sharing. We will follow up with you at {contact}."
                rows={3}
                className="resize-none"
              />
              <p className="text-[10px] text-muted-foreground mt-auto pt-1">Shown after they submit their email/phone. Use {'{contact}'} as a placeholder.</p>
            </div>
          </div>
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
