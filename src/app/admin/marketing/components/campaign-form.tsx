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
    <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=300&fit=crop" alt="Restaurant Kitchen" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi there,</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">I’m reaching out because I know you got into the restaurant business because you love food and hospitality, not because you wanted to manage printers, apologize for outdated prices, or fight with clunky POS systems.</p>
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
    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=300&fit=crop" alt="Premium Restaurant" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
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
    <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&h=300&fit=crop" alt="Seamless Ordering" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
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
    <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&h=300&fit=crop" alt="Modern QR Menu" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
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
    <img src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&h=300&fit=crop" alt="Food Imagery" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">People eat with their eyes.</h2>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Text-only menus are leaving money on the table. When guests see high-quality images of your dishes, they order more.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Nomenu includes built-in AI tools to automatically generate mouth-watering photos for your entire menu in seconds, no expensive food photographer required.</p>
  <ul style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
    <li><strong>Visual Upselling:</strong> Studies show visual menus increase order sizes by 20-30%.</li>
    <li><strong>AI Generation:</strong> Instantly create perfect images that match your brand.</li>
    <li><strong>Highlight Specials:</strong> Make your high-margin items impossible to resist.</li>
  </ul>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Boost Your Revenue</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>The Nomenu Team<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  b2b_labor_cost: {
    name: "The 'Labor Cost' Pitch (B2B)",
    subject: "Faster table turns & 0 bad Yelp reviews",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=300&fit=crop" alt="Restaurant Management" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi there,</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">I know labor costs and front-of-house bottlenecks are the biggest headaches in hospitality right now.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">We built Nomenu to fix exactly that. Guests simply scan a custom QR code at their table, order directly to your Kitchen Display System, and pay on their phones. No waiting, no order mistakes, and no friction.</p>
  <ul style="color: #475569; font-size: 16px; line-height: 1.6;">
    <li><strong>Increase table turns by 20%</strong> instantly</li>
    <li><strong>Syncs directly</strong> with your Square POS</li>
    <li><strong>AI intercepts 1-3 star reviews</strong> before they ever reach Yelp</li>
  </ul>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">See How It Works</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Can I show you a quick 2-minute demo of how this would look for your restaurant?</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  tech_chef_influencer: {
    name: "Tech Chef Influencer (Partnership)",
    subject: "Love your content! Quick partnership idea",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=300&fit=crop" alt="Chef Influencer" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hey!</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">I absolutely love the content you’re putting out for the restaurant industry. Your insights are always spot on.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">I'm the founder of Nomenu, a new restaurant OS that replaces waitstaff bottlenecks with a direct-to-KDS ordering system. We are launching an exclusive Partner Program, and I think your audience of restaurant owners would get massive value from it.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">We offer a <strong>20% recurring revenue share</strong> for every restaurant you refer. Since it integrates natively with Square POS, it’s a very easy sell to any restaurant wanting to cut labor costs and boost margins.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us/partners" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">View Partner Program</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Would you be open to chatting about a potential partnership?</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  vp_sales: {
    name: "VP of Sales / Executive Pitch",
    subject: "Building a unicorn in hospitality tech",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=600&h=300&fit=crop" alt="Sales Pitch" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi there,</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">I’ve been closely following your success scaling SaaS revenue. I’m the founder of Nomenu—a restaurant OS that replaces waitstaff bottlenecks with a direct-to-KDS ordering system and AI-driven Yelp protection.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">We have the product, the POS integrations, and the AI infrastructure fully built. Now, I am looking for a killer VP of Sales/GTM leader to build the outbound machine and scale us from early traction to $1M ARR and beyond.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Explore Nomenu</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">If you're interested in building a unicorn in the hospitality tech space, let's grab coffee.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  investor_deck: {
    name: "Seed Investor / VC Deck",
    subject: "Nomenu: Re-inventing Restaurant Operations",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop" alt="Investment Deck" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi there,</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">The biggest existential threat to restaurants right now is labor costs. Waitstaff overhead and slow table turns are crushing margins.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">At Nomenu, we’ve built an end-to-end OS that lets guests order and pay directly on their phones, injecting orders straight into a custom Kitchen Display System via Square POS.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">We are raising our Seed round to aggressively scale our outbound sales and partner channels.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">View Our Deck</a>
  </div>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">I would love to walk you through our traction and our 12-month roadmap.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
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
    <form onSubmit={onSubmit} className="space-y-8 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
      
      {/* 1. Audience Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">1. Select Audience</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className={"cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-colors " + (audience === 'free_users' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300')}>
            <input type="radio" name="audience" value="free_users" checked={audience === 'free_users'} onChange={() => setAudience('free_users')} className="sr-only" />
            <span className="font-bold text-slate-900">Existing Free Users</span>
            <span className="text-xs text-slate-500">Blast users who haven't upgraded yet.</span>
          </label>
          <label className={"cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-colors " + (audience === 'pro_users' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300')}>
            <input type="radio" name="audience" value="pro_users" checked={audience === 'pro_users'} onChange={() => setAudience('pro_users')} className="sr-only" />
            <span className="font-bold text-slate-900">Active Pro Users</span>
            <span className="text-xs text-slate-500">Announce new features to paid users.</span>
          </label>
          <label className={"cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-colors " + (audience === 'custom' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300')}>
            <input type="radio" name="audience" value="custom" checked={audience === 'custom'} onChange={() => setAudience('custom')} className="sr-only" />
            <span className="font-bold text-slate-900">Custom List</span>
            <span className="text-xs text-slate-500">Paste an external list of leads.</span>
          </label>
        </div>

        {audience === 'custom' && (
          <div className="mt-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">Paste Emails (Comma or newline separated)</label>
            <textarea 
              name="customEmails"
              rows={4}
              placeholder="john@restaurant.com, jane@cafe.com"
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>
        )}
      </div>

      <hr className="border-slate-200" />

      {/* 2. Template Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">2. Message Template</h2>
          </div>
          
          <select 
            name="template"
            value={template}
            onChange={(e) => handleTemplateChange(e.target.value as keyof typeof TEMPLATES)}
            className="bg-white border border-slate-200 shadow-sm text-sm rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <option key={key} value={key}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Subject Line</label>
            <input 
              name="subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-slate-200 shadow-sm rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              placeholder="Enter email subject"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
                <span>HTML Message Body</span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><FileText className="w-3 h-3"/> Accepts HTML</span>
              </label>
              <textarea 
                name="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={16}
                className="w-full bg-slate-50 border border-slate-200 shadow-sm rounded-lg p-3 text-sm text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                placeholder="<h1>Hello!</h1>"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Live Preview</label>
              <div className="w-full h-full min-h-[350px] bg-white border border-slate-200 shadow-sm rounded-lg p-0 overflow-hidden flex flex-col">
                <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium ml-2 font-mono truncate">Subject: {subject || "No subject"}</span>
                </div>
                <div 
                  className="p-4 flex-1 overflow-y-auto bg-white"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              </div>
            </div>
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
