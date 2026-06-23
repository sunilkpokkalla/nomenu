"use client";

import { useState, useTransition } from "react";
import { sendCampaignAction } from "../actions";
import { Loader2, Send, Users, Sparkles, FileText } from "lucide-react";

const TEMPLATES = {
  custom: {
    name: "Blank Canvas",
    subject: "",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://nomenu.us/hero-preview.png" alt="Nomenu Digital Menus" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Your message here...</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Visit Nomenu</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>The Nomenu Team<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`,
  },
  soulful_pitch: {
    name: "The Soulful Pitch (Cold Email)",
    subject: "Getting you back to the kitchen",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://nomenu.us/hero-preview.png" alt="Nomenu Digital Menus" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi there,</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">I’m reaching out because I know you opened a restaurant because you love food and hospitality, not because you wanted to manage printers, apologize for outdated prices, or fight with clunky POS systems.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">We believe technology in a restaurant should be completely invisible—it should just work. We've built a system that lets you replace your paper menus with stunning digital QR menus that you can update instantly from your phone. Plus, it routes orders directly to a beautiful Kitchen Display System so you never lose a paper ticket again.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Stop wrestling with operations and get back to doing what you do best.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">See Nomenu in Action</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Do you have 5 minutes next Tuesday for me to show you how Nomenu can transform your business?</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  pro_upgrade: {
    name: "Pro Upgrade Push",
    subject: "Unlock Premium Themes & Custom Domains",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://nomenu.us/hero-preview.png" alt="Nomenu Pro" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Take your brand to the next level.</h2>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">You have already set up your digital menu, but did you know you can completely transform how it looks to your guests?</p>
  <ul style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
    <li><strong>Premium Themes:</strong> Access luxury, vibrant, and cinematic menu designs.</li>
    <li><strong>Custom Domains:</strong> Use your own website link instead of nomenu.us.</li>
    <li><strong>No Watermarks:</strong> Remove the "Powered by Nomenu" branding.</li>
  </ul>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us/dashboard/billing" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Upgrade to Pro Today</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>The Nomenu Team<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  serverless_seamless: {
    name: "Seamless Operations Without Servers",
    subject: "Run your dining room without waitstaff",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://nomenu.us/hero-preview.png" alt="Nomenu Seamless Operations" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Eliminate front-of-house friction.</h2>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Are you struggling to hire and retain reliable servers? Or dealing with constant order mistakes being run back to the kitchen?</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Nomenu completely bridges the gap between your guests and your kitchen. Guests scan, browse your beautiful visual menu, and send orders directly to your Nomenu Kitchen Display System (KDS).</p>
  <ul style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
    <li><strong>No Servers Needed:</strong> Guests order at their own pace directly from their phones.</li>
    <li><strong>Zero Order Mistakes:</strong> Exactly what the guest selects is what the kitchen sees.</li>
    <li><strong>Faster Table Turns:</strong> No waiting for a server to take the order or drop the check.</li>
  </ul>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Explore Serverless Ordering</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Let technology handle the ordering, so your staff can focus purely on hospitality and food quality.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  modern_qr: {
    name: "The Modern QR Experience",
    subject: "Stop printing menus. Start shining.",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://nomenu.us/hero-preview.png" alt="Nomenu Digital Menus" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Your food deserves better than a sticky, outdated paper menu.</h2>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Did you know the average restaurant spends over $1,200 a year just reprinting menus due to price changes and stains?</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Nomenu turns your menu into a vibrant, digital experience. Update prices instantly from your phone, hide items when you 86 them in the kitchen, and showcase your best dishes with stunning photography.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Create Your Free Digital Menu</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>The Nomenu Team<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  revenue_booster: {
    name: "Revenue Booster",
    subject: "Increase check sizes by 20% effortlessly",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://nomenu.us/hero-preview.png" alt="Nomenu Upselling" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">People eat with their eyes.</h2>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">When a guest sees a high-definition photo of a sizzling appetizer or a perfectly crafted cocktail, they are 20% more likely to order it compared to reading plain text on a piece of paper.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">With Nomenu, you can easily attach photos to your high-margin items. You essentially give your restaurant an automated, silent upseller that never forgets to recommend the specials.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Boost Your Revenue Today</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>The Nomenu Team<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  }
};

export function CampaignForm() {
  const [isPending, startTransition] = useTransition();
  const [audience, setAudience] = useState<"free_users" | "pro_users" | "custom">("free_users");
  const [template, setTemplate] = useState<keyof typeof TEMPLATES>("custom");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleTemplateChange = (val: keyof typeof TEMPLATES) => {
    setTemplate(val);
    setSubject(TEMPLATES[val].subject);
    setMessage(TEMPLATES[val].body);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await sendCampaignAction(formData);
      if (result.success) {
        setFeedback({ type: 'success', message: result.message || 'Campaign sent!' });
        if (audience === 'custom') {
          // Reset form somewhat
        }
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to send campaign.' });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      
      {/* 1. Audience Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-medium text-white">1. Select Audience</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className={"cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-colors " + (audience === 'free_users' ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-800 bg-black/20 hover:border-neutral-700')}>
            <input type="radio" name="audience" value="free_users" checked={audience === 'free_users'} onChange={() => setAudience('free_users')} className="sr-only" />
            <span className="font-medium text-white">Existing Free Users</span>
            <span className="text-xs text-neutral-400">Blast users who haven't upgraded yet.</span>
          </label>
          <label className={"cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-colors " + (audience === 'pro_users' ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-800 bg-black/20 hover:border-neutral-700')}>
            <input type="radio" name="audience" value="pro_users" checked={audience === 'pro_users'} onChange={() => setAudience('pro_users')} className="sr-only" />
            <span className="font-medium text-white">Active Pro Users</span>
            <span className="text-xs text-neutral-400">Announce new features to paid users.</span>
          </label>
          <label className={"cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-colors " + (audience === 'custom' ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-800 bg-black/20 hover:border-neutral-700')}>
            <input type="radio" name="audience" value="custom" checked={audience === 'custom'} onChange={() => setAudience('custom')} className="sr-only" />
            <span className="font-medium text-white">Custom List</span>
            <span className="text-xs text-neutral-400">Paste an external list of leads.</span>
          </label>
        </div>

        {audience === 'custom' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Paste Emails (Comma or newline separated)</label>
            <textarea 
              name="customEmails"
              rows={4}
              placeholder="john@restaurant.com, jane@cafe.com"
              className="w-full bg-black/50 border border-neutral-800 rounded-lg p-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <hr className="border-neutral-800" />

      {/* 2. Template Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-medium text-white">2. Message Template</h2>
          </div>
          
          <select 
            name="template"
            value={template}
            onChange={(e) => handleTemplateChange(e.target.value as keyof typeof TEMPLATES)}
            className="bg-black/50 border border-neutral-800 text-sm rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <option key={key} value={key}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Subject Line</label>
            <input 
              name="subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-black/50 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="Enter email subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2 flex justify-between items-center">
              <span>HTML Message Body</span>
              <span className="text-xs text-neutral-500 font-normal flex items-center gap-1"><FileText className="w-3 h-3"/> Accepts HTML</span>
            </label>
            <textarea 
              name="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className="w-full bg-black/50 border border-neutral-800 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              placeholder="<h1>Hello!</h1>"
            />
          </div>
        </div>
      </div>

      {feedback && (
        <div className={"p-4 rounded-lg text-sm " + (feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20')}>
          {feedback.message}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {isPending ? "Sending Campaign..." : "Blast Campaign"}
        </button>
      </div>

    </form>
  );
}
