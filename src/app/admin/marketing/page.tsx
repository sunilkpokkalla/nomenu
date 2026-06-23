import { CampaignForm } from "./components/campaign-form";
import { MailOpen } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MarketingCampaignsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
          <MailOpen className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Marketing Campaigns</h1>
          <p className="text-neutral-400 mt-1 text-sm">
            Blast beautifully formatted emails to your existing free users, premium users, or a custom list of leads.
          </p>
        </div>
      </div>

      <CampaignForm />
      
    </div>
  );
}
