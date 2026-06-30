"use client";

import { useState } from "react";
import { Copy, Check, Users, TrendingUp, Building2, Megaphone } from "lucide-react";
import Image from "next/image";

interface TemplateProps {
  title: string;
  subject?: string;
  content: string;
  target: string;
  imageUrl?: string;
}

function CopyableTemplate({ template }: { template: TemplateProps }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = template.subject 
      ? `Subject: ${template.subject}\n\n${template.content}` 
      : template.content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {template.imageUrl && (
        <div className="relative w-full h-48 bg-slate-100 border-b border-slate-200">
          <Image 
            src={template.imageUrl} 
            alt={template.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">{template.title}</h3>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{template.target}</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-md transition-colors shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-4 bg-white text-sm text-slate-700 font-mono whitespace-pre-wrap flex-1">
        {template.subject && (
          <div className="mb-4 pb-4 border-b border-slate-100">
            <span className="font-bold text-slate-900">Subject: </span>
            {template.subject}
          </div>
        )}
        {template.content}
      </div>
    </div>
  );
}

export default function GrowthHubPage() {
  const influencerTemplates: TemplateProps[] = [
    {
      title: "The 'Tech Chef' Video Script (TikTok / Reels)",
      target: "Social Media / Video Influencers",
      imageUrl: "/marketing/tech_chef.png",
      content: `"Restaurant owners, you are losing money on slow table turns and bad Yelp reviews. I just found a system called Nomenu that literally runs your entire front-of-house from one QR scan." \n\n[Cut to scanning code]\n\n"Guests scan this, see a beautiful branded menu with AI-generated food photos, and order directly to the Kitchen Display. No server needed."\n\n[Cut to AI Review intercept feature]\n\n"The best part? If a customer leaves a 1-star review on the app, the AI automatically intercepts it and offers them a discount to come back *before* they can post it to Yelp. Check out Nomenu.us to automate your restaurant."`
    },
    {
      title: "Outreach DM to Restaurant Consultants",
      target: "Instagram / LinkedIn DMs",
      imageUrl: "/marketing/tech_chef.png",
      content: `Hey [Name], love your content on restaurant operations!\n\nWe've built Nomenu—an OS that lets restaurants run their entire ordering, KDS, and loyalty system from a single QR scan (plus it uses AI to intercept bad Yelp reviews). We think your audience of restaurant owners would go crazy for it.\n\nWould you be open to testing a free Enterprise account and doing a sponsored breakdown?`
    }
  ];

  const restaurantTemplates: TemplateProps[] = [
    {
      title: "The 'Labor Cost' Cold Email",
      target: "B2B Outreach (Restaurant Owners)",
      subject: "Faster table turns & 0 bad Yelp reviews at [Restaurant Name]",
      imageUrl: "/marketing/labor_cost.png",
      content: `Hi [Owner Name],\n\nI know labor costs and front-of-house bottlenecks are the biggest headaches in hospitality right now.\n\nWe built Nomenu to fix that. Guests scan a custom QR code on your table, order directly to your Kitchen Display System, and pay on their phones.\n\n- Increase table turns by 20%\n- Syncs directly with your Square POS\n- AI intercepts 1-3 star reviews before they ever reach Yelp\n\nCan I show you a 2-minute demo of how it would look for [Restaurant Name]? I've already generated a mockup menu for you.\n\nBest,\n[Your Name]`
    },
    {
      title: "The 'Walk-in' Leave-Behind Script",
      target: "In-Person Pitch",
      imageUrl: "/marketing/walkin_pitch.png",
      content: `Hey, I made this custom digital menu for [Restaurant Name]. If you scan it, you'll see your menu with AI-generated food photos. It connects directly to your Square POS. If you want to use it to speed up orders and cut down on waitstaff costs, let's talk. Here's my card.`
    }
  ];

  const investorTemplates: TemplateProps[] = [
    {
      title: "The Seed Round Pitch Outline",
      target: "VCs & Angel Investors",
      subject: "SaaS OS for Restaurants - 20% Faster Table Turns",
      imageUrl: "/marketing/growth_loop.png",
      content: `Hi [Investor Name],\n\nI’m the founder of Nomenu. We are replacing the fragmented restaurant tech stack (Square, Toast, Yelp, Loyalty apps) with a single, highly-sticky Operating System triggered by a QR scan.\n\nTraction & Product:\n- AI Menu Builder: Onboards restaurants in 60 seconds with AI-generated menus and photos.\n- Deep Integration: 2-way live sync with Square POS and built-in KDS.\n- The Kicker: Our AI Retention Engine intercepts bad reviews before they hit Yelp.\n- Distribution: B2B2C Viral loop. Every restaurant table becomes a billboard for our software.\n\nWe are raising a Seed round to scale our GTM motion and expand our integration marketplace. I’d love to share our deck and traction metrics with you this week.\n\nBest,\n[Your Name], CEO`
    },
    {
      title: "Recruiting a VP of Sales / Co-Founder",
      target: "Executive Outreach (LinkedIn)",
      subject: "Leading GTM for a disruptive Restaurant SaaS",
      imageUrl: "/marketing/growth_loop.png",
      content: `Hi [Name],\n\nI’ve been following your success scaling SaaS revenue at [Previous Company]. I’m the founder of Nomenu—a restaurant OS that replaces waitstaff bottlenecks with a direct-to-KDS ordering system and AI-driven Yelp protection.\n\nWe have the product, the POS integrations (Square), and the AI infrastructure. I am looking for a killer VP of Sales/GTM leader to build the outbound machine and scale us from early traction to $1M ARR and beyond.\n\nIf you're interested in building a unicorn in the hospitality tech space, let's grab coffee.`
    }ffee.`
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Growth Hub & Marketing Templates
        </h1>
        <p className="text-slate-500 font-medium">
          Central repository for 360° marketing campaigns, outreach templates, and scaling strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Social Media & Influencers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 mb-6">
            <Megaphone className="w-5 h-5" />
            <h2 className="text-lg font-extrabold tracking-tight">Social & Influencers</h2>
          </div>
          <div className="space-y-6">
            {influencerTemplates.map((template, idx) => (
              <CopyableTemplate key={idx} template={template} />
            ))}
          </div>
        </div>

        {/* B2B Restaurant Owners */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-6">
            <Building2 className="w-5 h-5" />
            <h2 className="text-lg font-extrabold tracking-tight">B2B Outreach (Restaurants)</h2>
          </div>
          <div className="space-y-6">
            {restaurantTemplates.map((template, idx) => (
              <CopyableTemplate key={idx} template={template} />
            ))}
          </div>
        </div>

        {/* Investors & Executives */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 text-rose-600 mb-6 mt-4 pt-8 border-t border-slate-200">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-extrabold tracking-tight">Investors & Executives</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investorTemplates.map((template, idx) => (
              <CopyableTemplate key={idx} template={template} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
