import { useState } from "react";
import { Settings, Save, Globe, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateFeedbackStrategy, generateRecoveryStrategy } from "./actions";

interface FeedbackSettingsModalProps {
  initialLoyaltyPin: string;
  initialRecoveryOffer: string;
  initialRecoveryMessage: string;
}

export function FeedbackSettingsModal({
  initialLoyaltyPin,
  initialRecoveryOffer,
  initialRecoveryMessage,
}: FeedbackSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recoveryOffer, setRecoveryOffer] = useState(initialRecoveryOffer);
  const [recoveryMessage, setRecoveryMessage] = useState(initialRecoveryMessage);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateRecoveryStrategy();
      if (result.success && result.offer && result.message) {
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" /> Strategy Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Strategy Settings</DialogTitle>
          <DialogDescription>
            Configure your feedback strategies to convert angry customers into regulars, and turn regulars into promoters.
          </DialogDescription>
        </DialogHeader>

        <form action={updateFeedbackStrategy} className="space-y-6 mt-4">
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
              />
              <p className="text-[10px] text-muted-foreground">Used by staff to stamp a customer's digital 5-star loyalty card.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Service Recovery (1-3 Stars)
              </h3>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate with AI
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recoveryOfferText">Apology Offer (Optional)</Label>
              <Textarea 
                id="recoveryOfferText" 
                name="recoveryOfferText" 
                value={recoveryOffer}
                onChange={(e) => setRecoveryOffer(e.target.value)}
                placeholder="e.g. 15% off your next visit with code MAKEITRIGHT15"
                rows={2}
              />
              <p className="text-[10px] text-muted-foreground">The discount or offer shown to win them back.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recoveryMessage">Follow-up Message</Label>
              <Textarea 
                id="recoveryMessage" 
                name="recoveryMessage" 
                value={recoveryMessage}
                onChange={(e) => setRecoveryMessage(e.target.value)}
                placeholder="Thank you. Our manager has been notified and will reach out to you at {contact} to apologize personally."
                rows={2}
              />
              <p className="text-[10px] text-muted-foreground">Use {'{contact}'} as a placeholder for their email/phone.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" onClick={() => setTimeout(() => setIsOpen(false), 500)}>
              <Save className="mr-2 h-4 w-4" /> Save Strategy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
