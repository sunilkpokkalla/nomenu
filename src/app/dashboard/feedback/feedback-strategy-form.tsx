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
  initialManagerVisitTimerMinutes: number;
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
  initialManagerVisitTimerMinutes,
}: FeedbackStrategyFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recoveryOffer, setRecoveryOffer] = useState(initialRecoveryOffer);
  const [recoveryMessage, setRecoveryMessage] = useState(initialRecoveryMessage);
  const [serviceRecoveryMessage, setServiceRecoveryMessage] = useState(initialServiceRecoveryMessage);
  
  // Toggles state (used just for optimistic UI, but form submittals use hidden inputs or Switch names)
  const [serviceRecoveryEnabled, setServiceRecoveryEnabled] = useState(initialServiceRecoveryEnabled);
  const [offerManagerVisit, setOfferManagerVisit] = useState(initialOfferManagerVisit);
  const [offerCompensation, setOfferCompensation] = useState(initialOfferCompensation);
  const [managerVisitTimerMinutes, setManagerVisitTimerMinutes] = useState(initialManagerVisitTimerMinutes);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateRecoveryStrategy();
      if ("success" in result && result.success && result.offer && result.resolutionMessage && result.initialMessage) {
        setServiceRecoveryMessage(result.initialMessage);
        setRecoveryOffer(result.offer);
        setRecoveryMessage(result.resolutionMessage);
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
            
          <div className="pt-6 space-y-8 p-5">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-8 text-xs font-medium shadow-sm border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                ✨ Generate AI Strategy
              </Button>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 text-sm">Offer Immediate Manager Visit</h3>
                    <p className="text-sm text-slate-500">
                      Ask the customer if they want a manager at their table. If yes, starts a real-time countdown.
                    </p>
                  </div>
                  <Switch 
                    id="offerManagerVisit" 
                    name="offerManagerVisit"
                    checked={offerManagerVisit}
                    onCheckedChange={setOfferManagerVisit}
                  />
                </div>
                
                {offerManagerVisit && (
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <Label htmlFor="managerVisitTimerMinutes" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                      Timer Duration (Minutes):
                    </Label>
                    <Input
                      id="managerVisitTimerMinutes"
                      name="managerVisitTimerMinutes"
                      type="number"
                      min={1}
                      max={60}
                      value={managerVisitTimerMinutes}
                      onChange={(e) => setManagerVisitTimerMinutes(parseInt(e.target.value) || 5)}
                      className="w-24 h-9 bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-row items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50">
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-900 text-sm">Fallback Compensation</h3>
                  <p className="text-sm text-slate-500">
                    Automatically offer an apology discount if the manager fails to arrive before the 5-minute timer ends.
                  </p>
                </div>
                <Switch 
                  id="offerCompensation" 
                  name="offerCompensation"
                  checked={offerCompensation}
                  onCheckedChange={setOfferCompensation}
                />
              </div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label htmlFor="serviceRecoveryMessage">Initial Prompt</Label>
                </div>
                <Textarea 
                  id="serviceRecoveryMessage" 
                  name="serviceRecoveryMessage" 
                  value={serviceRecoveryMessage}
                  onChange={(e) => setServiceRecoveryMessage(e.target.value)}
                  placeholder="We clearly missed the mark today. Would you like a manager to come to your table right now to fix this?"
                  rows={2}
                  className="resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-auto pt-1">Shown immediately on a 1-3 star review.</p>
              </div>

              {offerCompensation && (
                <div className="space-y-2 flex flex-col animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recoveryOfferText">Fallback Compensation Offer</Label>
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
                  <p className="text-[10px] text-muted-foreground mt-auto pt-1">Shown if the customer says the manager did not arrive.</p>
                </div>
              )}

              <div className="space-y-2 flex flex-col">
                <div className="flex items-center justify-between">
                  <Label htmlFor="recoveryMessage">Resolution / Closing Message</Label>
                </div>
                <Textarea 
                  id="recoveryMessage" 
                  name="recoveryMessage" 
                  value={recoveryMessage}
                  onChange={(e) => setRecoveryMessage(e.target.value)}
                  placeholder="Thank you for your time. We will try our best to ensure you never regret coming back."
                  rows={2}
                  className="resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-auto pt-1">Shown when the issue is resolved (e.g. manager arrived, or they declined a visit).</p>
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
