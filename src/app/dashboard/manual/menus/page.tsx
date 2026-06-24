import Link from "next/link";
import { ArrowLeft, ChefHat, Plus, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Managing Menus - Manual | NoMenu",
};

export default function MenusManualPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Back Navigation */}
      <Link 
        href="/dashboard/manual"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Documentation Index
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 pb-8 border-b border-slate-200">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
          <ChefHat className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Managing Menus</h1>
        <p className="text-xl text-slate-500">
          Learn how to build your digital menu, organize categories, and manage food items.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm">In this guide</h3>
        <ul className="space-y-3">
          <li><a href="#creating-menus" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">1. Creating a New Menu</a></li>
          <li><a href="#adding-categories" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">2. Adding Categories</a></li>
          <li><a href="#creating-items" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">3. Creating Food Items</a></li>
          <li><a href="#allergens" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">4. Managing Allergens & Dietary Tags</a></li>
          <li><a href="#ai-features" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">5. AI Integration & Magic Import</a></li>
        </ul>
      </div>

      <div className="space-y-16">
        
        {/* Section 1 */}
        <section id="creating-menus" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Creating a New Menu
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            NoMenu allows you to create multiple distinct menus. For example, you might want a "Breakfast Menu" that is only active in the morning, and a "Dinner Menu" active at night.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Step-by-Step:</h4>
            <ol className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Navigate to the <strong>Menus</strong> tab in your dashboard sidebar.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Click the <strong>Create Menu</strong> button in the top right corner.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Give your menu a name (e.g., "Main Dining"). It will immediately be added to your list.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>You can toggle the "Active" switch to turn the menu on or off. Customers scanning your QR code will only see active menus.</span>
              </li>
            </ol>
          </div>
        </section>

        {/* Section 2 */}
        <section id="adding-categories" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Adding Categories
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Categories organize your menu items (e.g., Starters, Mains, Desserts, Drinks). 
          </p>
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
            <p className="text-rose-800">
              <strong>Note:</strong> To add a category, you must first click the <strong>"Manage Categories"</strong> button inside a specific menu. Categories are unique to each menu.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="creating-items" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Creating Food Items
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            This is where you add the actual dishes your customers will order. 
          </p>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ol className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Navigate to the <strong>Items</strong> tab in your sidebar.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>Click the <strong>Add Item</strong> button.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span><strong>Details:</strong> Enter the Name, Description, and Price. Be descriptive—appetizing descriptions increase sales!</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span><strong>Image:</strong> Upload a high-quality photo. Menus with photos see a 30% increase in conversion rates. The system will automatically compress and optimize your image.</span>
              </li>
            </ol>
          </div>
        </section>

        {/* Section 4 */}
        <section id="allergens" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
            Managing Allergens & Dietary Tags
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            When creating or editing an item, you will see a series of toggle switches for dietary tags.
          </p>
          <ul className="grid grid-cols-2 gap-4 mt-4">
            <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium">Vegetarian</span>
            </li>
            <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="font-medium">Vegan</span>
            </li>
            <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="font-medium">Gluten Free</span>
            </li>
            <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="font-medium">Spicy</span>
            </li>
          </ul>
          <p className="text-slate-500 mt-4 text-sm">
            Toggling these on will display beautiful badges next to the item on your live menu, helping customers with dietary restrictions order safely.
          </p>
        </section>

        {/* Section 5 */}
        <section id="ai-features" className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
            AI Integration & Magic Import
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            NoMenu has Google Gemini AI integrated directly into your workflow to save you hours of manual data entry.
          </p>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm mt-4">
            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              ✨ Magic AI Import
            </h4>
            <p className="text-indigo-800 mb-4">Have an old menu in a PDF, Word document, or on your website? Don't type it out manually!</p>
            <ul className="list-disc list-inside space-y-2 text-indigo-800 ml-2 mb-6">
              <li>Click <strong>Magic Import</strong> inside your menu's category page.</li>
              <li>Paste the raw text of your entire menu into the box.</li>
              <li>The AI will automatically read it, sort the items into categories, extract prices, and write mouth-watering descriptions for every dish.</li>
            </ul>

            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              🤖 AI Writer for Items & Categories
            </h4>
            <p className="text-indigo-800 mb-2">Struggling to write a description for a new dish?</p>
            <p className="text-indigo-800">Just type the name of the dish (e.g. "Truffle Fries") and click the <strong>✨ AI Writer</strong> button inside the item creation form. Our AI will instantly generate an appetizing, professional description that drives sales.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
