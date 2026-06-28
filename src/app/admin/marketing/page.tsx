import { CampaignForm } from "./components/campaign-form";
import { MailOpen } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MarketingCampaignsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="bg-indigo-100 p-3 rounded-xl border border-indigo-200">
          <MailOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Marketing Blast</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Blast beautifully formatted emails to your existing free users, premium users, or a custom list of leads.
          </p>
        </div>
      </div>

      <CampaignForm />
      
    </div>
  );
}
