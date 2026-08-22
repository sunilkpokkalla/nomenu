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
    <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=300&fit=crop" alt="Fine Dining" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Turn your menu into a passive sales engine.</h2>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">When a guest sits down at a table, they are ready to spend. But if your servers are busy running drinks, those guests are waiting instead of ordering.</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Nomenu's smart checkout features and active cart encourage immediate ordering. Combined with beautiful visual categories, our restaurant partners experience a 15-20% average boost in check size with no extra effort from waitstaff.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Maximize Your Revenue</a>
  </div>
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
  },
  onboarding_guide: {
    name: "User Onboarding & Quick-Start Guide",
    subject: "Your 3-Step Setup Plan: How to launch your digital menu in 5 minutes! 🚀",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  
  <!-- Header Info / Support -->
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
    <span style="font-weight: bold; color: #0f172a; font-size: 18px;">Nomenu</span>
    <span style="font-size: 13px; color: #64748b;">Need help? Email <a href="mailto:support@nomenu.us" style="color: #2563eb; text-decoration: none;">support@nomenu.us</a></span>
  </div>

  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=250&fit=crop" alt="Digital Menu Setup" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>

  <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Ready to wow your guests? Let's get set up!</h2>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Hi there,</p>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Welcome to Nomenu! We noticed you onboarded recently. If you are not sure where to start, don't worry—getting your digital menu live takes less than 5 minutes. Here is your quick-start roadmap:</p>

  <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin: 24px 0;">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; font-weight: 700;">Your 3-Step Setup Plan</h3>
    
    <ol style="color: #475569; font-size: 14px; line-height: 1.8; margin-bottom: 0; padding-left: 20px;">
      <li style="margin-bottom: 10px;">
        <strong>Create a Menu:</strong> Log into your dashboard, go to the <strong>Menus</strong> tab, and click <em>"Create Menu"</em>. Give it a name (e.g., "Main Menu", "Drinks Menu") and choose your style.
      </li>
      <li style="margin-bottom: 10px;">
        <strong>Create Menu Items:</strong> Inside your newly created menu, click on <em>"Add Item"</em>. Put in the dish name, description, price, and upload a delicious photo to entice guests.
      </li>
      <li>
        <strong>Create QR Codes:</strong> Navigate to the <strong>QR Codes</strong> section in the sidebar. Generate a QR code linked directly to your menu. You can customize the styling, frame templates, and colors, then download it for print!
      </li>
    </ol>
  </div>

  <p style="color: #475569; font-size: 15px; line-height: 1.6; font-weight: 600;">💡 Motivation: Restaurants using digital menus experience up to a 20% increase in order values and zero reprint costs.</p>

  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us/dashboard" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Go to Dashboard & Start Creating</a>
  </div>

  <p style="color: #475569; font-size: 14px; line-height: 1.6;">If you have any doubts, need help setting things up, or want a quick walkthrough, just reach out to us at <a href="mailto:support@nomenu.us" style="color: #2563eb; text-decoration: none;">support@nomenu.us</a> or click the Support button in the dashboard header.</p>
  
  <p style="color: #475569; font-size: 14px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  welcome_discount_15: {
    name: "Welcome Discount (15% Off)",
    subject: "Claim your 15% discount on Nomenu Pro! 🎁",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  
  <!-- Header Info / Support -->
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
    <span style="font-weight: bold; color: #0f172a; font-size: 18px;">Nomenu</span>
    <span style="font-size: 13px; color: #64748b;">Need help? Email <a href="mailto:support@nomenu.us" style="color: #2563eb; text-decoration: none;">support@nomenu.us</a></span>
  </div>

  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=250&fit=crop" alt="Exclusive Discount" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>

  <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Unlock the full power of your digital menu.</h2>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Hi there,</p>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">We hope you are enjoying your Nomenu digital experience! To help you take your brand to the next level, we are offering an exclusive <strong>15% discount</strong> on all our annual plans.</p>

  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
    <span style="font-size: 13px; font-weight: bold; color: #166534; text-transform: uppercase; letter-spacing: 1px;">Limited Time Offer</span>
    <h3 style="margin: 8px 0; color: #15803d; font-size: 24px; font-weight: 900;">15% OFF ANNUAL PLANS</h3>
    <p style="margin: 0; font-size: 14px; color: #166534;">Use our special welcome referral link below to automatically apply your 15% discount at checkout.</p>
  </div>

  <h3 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 24px; margin-bottom: 12px;">What you unlock with Pro & Elite:</h3>
  <ul style="color: #475569; font-size: 14px; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
    <li><strong>Premium Themes:</strong> Access custom, cinematic, and gorgeous menu styles that match your brand.</li>
    <li><strong>Custom Domain:</strong> Host your menu on your own custom web link (e.g., menu.yourrestaurant.com).</li>
    <li><strong>Zero Watermarks:</strong> Remove the "Powered by Nomenu" tag for a completely white-labeled experience.</li>
    <li><strong>Unlimited Orders & KDS:</strong> Access our high-end Kitchen Display System for seamless order routing.</li>
  </ul>

  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us?ref=WELCOME" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2);">Claim 15% Off Now</a>
  </div>

  <p style="color: #475569; font-size: 14px; line-height: 1.6;">If you have any questions or need help setting up your menu first, feel free to reply directly to this email or reach out to us at <a href="mailto:support@nomenu.us" style="color: #2563eb; text-decoration: none;">support@nomenu.us</a>.</p>
  
  <p style="color: #475569; font-size: 14px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  kds_kitchen_display: {
    name: "Kitchen Display System (KDS) Upgrade",
    subject: "Stop losing paper tickets in the kitchen 🍳",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=250&fit=crop" alt="Kitchen Display System" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Real-time digital ticket routing for your chefs.</h2>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Lost orders, greasy ticket printers, and misheard modifications slow down your line and ruin guest experiences.</p>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Nomenu's Kitchen Display System (KDS) streams table and takeaway orders straight to kitchen touchscreens in real time with color-coded timers.</p>
  <ul style="color: #475569; font-size: 14px; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
    <li><strong>Instant Order Sync:</strong> Orders appear immediately as guests pay or order at the table.</li>
    <li><strong>Live Prep Timers:</strong> Track ticket age and eliminate long wait times.</li>
    <li><strong>Zero Ink & Printer Paper:</strong> Save hundreds every year on thermal paper rolls.</li>
  </ul>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us/dashboard" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Try Nomenu KDS</a>
  </div>
  <p style="color: #475569; font-size: 14px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  happy_hour_promo: {
    name: "Automated Happy Hour & Dynamic Menus",
    subject: "Automate your Happy Hour specials on Nomenu 🍹",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=250&fit=crop" alt="Happy Hour Specials" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Schedule price updates automatically.</h2>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Forgetting to switch back menu pricing after Happy Hour? Tired of printing separate drink cards?</p>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">With Nomenu, you can schedule automated menu dynamic changes so your Happy Hour discounts, weekend specials, and late-night menus activate automatically at preset times.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us/dashboard" style="display: inline-block; background-color: #d97706; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Schedule Happy Hour</a>
  </div>
  <p style="color: #475569; font-size: 14px; line-height: 1.6;">Best,<br>The Nomenu Team<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  multi_location: {
    name: "Multi-Location & Franchise Management",
    subject: "Manage all your restaurant locations in one dashboard 🏢",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=250&fit=crop" alt="Multi-Location Restaurant" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Scale your restaurant group seamlessly.</h2>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Managing separate digital menus across multiple restaurant branches can quickly get chaotic.</p>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Nomenu Multi-Location allows group owners to centralize brand themes, deploy master menus, and grant store managers isolated location controls.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Explore Multi-Location</a>
  </div>
  <p style="color: #475569; font-size: 14px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  review_booster: {
    name: "5-Star Review & Feedback Collector",
    subject: "Turn dining guests into 5-star Google reviews ⭐",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=250&fit=crop" alt="Customer Reviews" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Capture positive feedback at the table.</h2>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">Nomenu includes built-in instant feedback prompts when guests finish viewing your menu or ordering. Direct happy customers straight to Google Reviews while routing private feedback directly to management.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us/dashboard" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Boost Google Reviews</a>
  </div>
  <p style="color: #475569; font-size: 14px; line-height: 1.6;">Best,<br>The Nomenu Team<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  },
  loyalty_rewards: {
    name: "VIP Customer Loyalty & Repeat Visits",
    subject: "Bring guests back twice as often with Nomenu Loyalty 🎁",
    body: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=250&fit=crop" alt="Digital Loyalty Program" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Digital punch cards directly on guests' phones.</h2>
  <p style="color: #475569; font-size: 15px; line-height: 1.6;">No paper cards to lose. Reward your regulars with seamless digital stamp cards right from your QR menu.</p>
  <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
    <a href="https://nomenu.us/dashboard" style="display: inline-block; background-color: #9333ea; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Activate Loyalty Club</a>
  </div>
  <p style="color: #475569; font-size: 14px; line-height: 1.6;">Best,<br>Sunil<br>Founder, Nomenu<br><a href="https://nomenu.us" style="color: #2563eb; text-decoration: none;">nomenu.us</a></p>
</div>`
  }
};

export function CampaignForm() {
  const [isPending, startTransition] = useTransition();
  const [audience, setAudience] = useState<"free_users" | "pro_users" | "custom" | "nomi_leads">("free_users");
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
          <label className={"cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-colors " + (audience === 'nomi_leads' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300')}>
            <input type="radio" name="audience" value="nomi_leads" checked={audience === 'nomi_leads'} onChange={() => setAudience('nomi_leads')} className="sr-only" />
            <span className="font-bold text-slate-900">Nomi Chatbot Leads</span>
            <span className="text-xs text-slate-500">Blast captured emails of chatbot visitors.</span>
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
