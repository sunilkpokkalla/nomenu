const fs = require('fs');
const path = require('path');

const articles = [
  { slug: 'short-staffed-kitchen', title: 'How to Handle a Short-Staffed Kitchen on a Friday Night', img: '/blog/short_staffed_kitchen.png', excerpt: 'Practical strategies to keep orders flowing when you are down two line cooks and a server.' },
  { slug: 'cost-of-paper-menus', title: 'The True Cost of Paper Menus: Printing and Design Expenses', img: '/blog/paper_menu_cost.png', excerpt: 'Why that $0.50 piece of paper is actually costing your restaurant thousands of dollars a year in lost revenue.' },
  { slug: 'gen-z-qr-codes', title: 'Why Gen Z Diners Prefer QR Codes Over Human Servers', img: '/blog/gen_z_qr_code.png', excerpt: 'Understanding the dining preferences of the digital-native generation and how to cater to them.' },
  { slug: 'automating-restaurant-loyalty', title: 'Automating Restaurant Loyalty: Moving Beyond Punch Cards', img: '', excerpt: 'Discover how digital ordering systems build customer retention automatically without physical cards.' },
  { slug: 'increase-drink-sales', title: '5 Ways to Increase Drink Sales Without Upselling', img: '', excerpt: 'Use visual digital menus to drive high-margin beverage sales without pressuring your guests.' },
  { slug: 'death-of-kiosk', title: 'The Death of the Kiosk: Why BYOD is the Future of Ordering', img: '', excerpt: 'Why investing in expensive hardware kiosks is a mistake for modern quick-service restaurants.' },
  { slug: 'setup-ghost-kitchen', title: 'How to Setup a Ghost Kitchen in 48 Hours', img: '', excerpt: 'The complete software and operational blueprint for launching a delivery-only brand this weekend.' },
  { slug: 'allergen-requests-safety', title: 'Managing Allergen Requests Safely with Digital Menus', img: '', excerpt: 'Eliminate the terrifying game of telephone between guests, servers, and the kitchen.' },
  { slug: 'live-sync-pos', title: 'Why Your Restaurant Needs a Live Sync POS Integration', img: '', excerpt: 'The operational nightmare of 86ing an item on paper versus syncing it globally in 2 seconds.' },
  { slug: 'psychology-menu-design', title: 'The Psychology of Menu Design: Colors and Layouts', img: '', excerpt: 'How to structure your digital menu layout to naturally draw the eye to your highest margin items.' },
  { slug: 'intercept-google-reviews', title: 'How to Intercept 1-Star Google Reviews Automatically', img: '', excerpt: 'Catch negative feedback before it goes public with automated post-meal satisfaction surveys.' },
  { slug: 'coffee-shops-ordering', title: 'Why Coffee Shops are Ditching Square for Dedicated Apps', img: '', excerpt: 'The specific needs of high-volume cafes and why generic point-of-sale systems fall short.' },
  { slug: 'dynamic-pricing-happy-hour', title: 'Setting Up Dynamic Pricing for Happy Hour', img: '', excerpt: 'Automate your price changes at 4:00 PM exactly, without reprinting a single menu.' },
  { slug: 'reduce-food-waste', title: 'How to Reduce Food Waste with Real-Time Inventory Sync', img: '', excerpt: 'Connecting your digital orders directly to your prep lists to ensure perfect par levels.' },
  { slug: 'zero-commission-platforms', title: 'The Benefits of Zero-Commission Ordering Platforms', img: '', excerpt: 'Stop paying a 30% tax to delivery apps. How to take back control of your customer data and margins.' },
  { slug: 'fine-dining-to-fast-casual', title: 'Transitioning from Fine Dining to Fast Casual: A Tech Guide', img: '', excerpt: 'The technology stack required to pivot your full-service concept into a high-volume counter model.' },
  { slug: 'optimize-table-layout', title: 'How to Optimize Your Table Layout for Faster Turnover', img: '', excerpt: 'The architectural and digital strategies that increase your seats-per-hour metric.' },
  { slug: 'securing-customer-data', title: 'Securing Customer Data in the Era of Digital Dining', img: '', excerpt: 'What every restaurant owner needs to know about PCI compliance and data privacy.' },
  { slug: 'multi-language-menus', title: 'Creating Multi-Language Menus Instantly with AI', img: '', excerpt: 'Serve tourists perfectly by offering your menu in 14 languages with a single click.' },
  { slug: 'future-of-hospitality', title: 'The Future of Hospitality: AI, Automation, and Personalization', img: '', excerpt: 'A look at the next 5 years of restaurant technology and how to prepare your business.' },
];

const dir = path.join(__dirname, 'src', 'content', 'blog');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

articles.forEach((article, index) => {
  const content = `---
title: "${article.title}"
date: "2024-04-${String(index + 1).padStart(2, '0')}"
excerpt: "${article.excerpt}"
author: "NoMenu Team"
coverImage: "${article.img}"
---

Content for this article is being written. Check back soon for the full deep dive into ${article.title.toLowerCase()}.
`;
  fs.writeFileSync(path.join(dir, article.slug + '.md'), content);
});
console.log('20 articles scaffolded successfully!');
