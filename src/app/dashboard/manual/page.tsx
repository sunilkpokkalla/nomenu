import Link from "next/link";
import { 
  BookOpen, 
  ChefHat, 
  Palette, 
  QrCode, 
  LineChart, 
  MonitorPlay,
  ArrowRight,
  LifeBuoy
} from "lucide-react";

export const metadata = {
  title: "User Manual | NoMenu Dashboard",
  description: "Official documentation and guides for NoMenu.",
};

const CATEGORIES = [
  {
    title: "Managing Menus",
    description: "Learn how to create menus, add categories, and manage individual items, prices, and allergens.",
    href: "/dashboard/manual/menus",
    icon: ChefHat,
    bgClass: "bg-rose-100",
    textClass: "text-rose-600"
  },
  {
    title: "Brand Customization",
    description: "Set up your logo, banner, color themes, and typography to make your menu unique to your brand.",
    href: "/dashboard/manual/customize",
    icon: Palette,
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-600"
  },
  {
    title: "Generating QR Codes",
    description: "Create table-specific QR codes, assign them to zones, and design beautiful print-ready SVGs.",
    href: "/dashboard/manual/qr-codes",
    icon: QrCode,
    bgClass: "bg-blue-100",
    textClass: "text-blue-600"
  },
  {
    title: "Live Order KDS",
    description: "Master the Kitchen Display System to track orders, manage states, and process instant refunds.",
    href: "/dashboard/manual/orders",
    icon: MonitorPlay,
    bgClass: "bg-orange-100",
    textClass: "text-orange-600"
  },
  {
    title: "Analytics & Payouts",
    description: "Understand your sales data, read the performance charts, and track your Stripe payouts.",
    href: "/dashboard/manual/analytics",
    icon: LineChart,
    bgClass: "bg-purple-100",
    textClass: "text-purple-600"
  }
];

export default function ManualIndexPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-2 pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <BookOpen className="w-8 h-8" />
          </div>
          NoMenu Documentation
        </h1>
        <p className="text-lg text-slate-500 mt-2 max-w-3xl">
          Welcome to the official NoMenu user manual. Select a category below to view detailed, step-by-step instructions on how to set up and master your application.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              key={category.href} 
              href={category.href}
              className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${category.bgClass} ${category.textClass} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{category.title}</h2>
                <p className="text-slate-500 leading-relaxed">
                  {category.description}
                </p>
              </div>
              
              <div className="mt-8 flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform duration-300">
                Read Documentation <ArrowRight className="ml-2 w-5 h-5" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Support Banner */}
      <div className="mt-12 bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shrink-0">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Still need help?</h2>
            <p className="text-slate-600 leading-relaxed max-w-xl">
              Can&apos;t find what you&apos;re looking for in the manual? Our dedicated support team is available to assist you directly.
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/support"
          className="shrink-0 bg-white hover:bg-slate-50 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors border border-slate-200 shadow-sm whitespace-nowrap"
        >
          Open Support Ticket
        </Link>
      </div>

    </div>
  );
}
