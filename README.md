# NoMenu 🍽️

NoMenu is a next-generation SaaS platform designed for restaurants to modernize their dining experience. It provides interactive digital menus, a comprehensive customer feedback loop, and automated retention and loyalty systems.

## Features

### 📱 Digital Smart Menus
- **QR Code Menus:** Customers scan a QR code at their table to instantly view the menu.
- **Dynamic Content:** Real-time updates for 86'd items, price changes, and daily specials.
- **Design System:** Premium themes tailored for different restaurant vibes (e.g., Luxury, Minimalist, Vibrant).

### 💬 Customer Feedback Loop & Service Recovery
- **Real-Time Feedback:** Customers can submit feedback directly from their phone while still at the table.
- **Service Recovery Strategy:** Intercept 1-3 star reviews instantly. Generate custom apology offers (e.g., "15% off your next visit") and follow-up messages automatically using Gemini AI to save at-risk relationships.
- **Data Export:** Advanced filtering and CSV export capabilities allowing owners to download feedback data—including customer names and emails—for marketing and analysis.

### ✨ Loyalty & Retention Engine
- **Staff Stamp PIN:** Digitize the classic punch-card. Staff use a secret 4-digit PIN to securely stamp a customer's device.
- **Automated Retention Ideas:** The dashboard provides AI-driven suggestions to convert happy 4-5 star reviewers into raving regulars.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, shadcn/ui
- **Backend/Database:** Supabase (PostgreSQL), Next.js Server Actions
- **AI Integration:** Google Gemini 2.5 Flash (used for generating menu descriptions and service recovery strategies)

## Getting Started

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up your `.env.local` file with your Supabase and Gemini API credentials.
4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
