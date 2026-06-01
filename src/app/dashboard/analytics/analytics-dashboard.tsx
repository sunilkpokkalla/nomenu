"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, ShoppingBag, Crown, QrCode, Sparkles, BarChart3, Receipt, Crosshair, Users } from "lucide-react";
import Image from "next/image";

interface AnalyticsDashboardProps {
  isLocked: boolean;
  revenueData: { dateStr: string; amount: number; orders: number; scans: number }[];
  totalRevenue: number;
  totalOrders: number;
  totalScans: number;
  aov: number;
  conversionRate: number;
  topItems: { id: string; name: string; image_url: string; quantity: number; revenue: number }[];
  topTables: { table_number: string; orders: number; revenue: number }[];
  categoryData: { name: string; value: number }[];
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AnalyticsDashboard({
  isLocked,
  revenueData,
  totalRevenue,
  totalOrders,
  totalScans,
  aov,
  conversionRate,
  topItems,
  topTables,
  categoryData
}: AnalyticsDashboardProps) {

  // For locked state, we inject beautiful fake data to make the background look busy and impressive.
  const displayRevenue = isLocked ? 14250.00 : totalRevenue;
  const displayOrders = isLocked ? 342 : totalOrders;
  const displayScans = isLocked ? 1845 : totalScans;
  const displayAov = isLocked ? 41.66 : aov;
  const displayConversion = isLocked ? 18.5 : conversionRate;
  
  const displayChartData = isLocked ? [
    { dateStr: "Mon", amount: 1200, orders: 30, scans: 150 },
    { dateStr: "Tue", amount: 1800, orders: 45, scans: 220 },
    { dateStr: "Wed", amount: 1500, orders: 38, scans: 190 },
    { dateStr: "Thu", amount: 2400, orders: 60, scans: 300 },
    { dateStr: "Fri", amount: 3200, orders: 75, scans: 450 },
    { dateStr: "Sat", amount: 4100, orders: 95, scans: 580 },
    { dateStr: "Sun", amount: 2800, orders: 68, scans: 400 },
  ] : revenueData;

  const displayCategoryData = isLocked ? [
    { name: "Mains", value: 6500 },
    { name: "Drinks", value: 3200 },
    { name: "Appetizers", value: 2400 },
    { name: "Desserts", value: 1150 },
    { name: "Sides", value: 1000 },
  ] : categoryData;

  const displayTopItems = isLocked ? [
    { id: "1", name: "Truffle Ribeye Steak", image_url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=200&fit=crop", quantity: 84, revenue: 4620 },
    { id: "2", name: "Seared Scallops", image_url: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=200&h=200&fit=crop", quantity: 112, revenue: 3136 },
    { id: "3", name: "French Onion Soup", image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop", quantity: 156, revenue: 1872 },
    { id: "4", name: "Lobster Ravioli", image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop", quantity: 65, revenue: 1560 },
  ] : topItems;

  const displayTopTables = isLocked ? [
    { table_number: "Table 12 (Window)", orders: 45, revenue: 2150 },
    { table_number: "Table 04 (Booth)", orders: 38, revenue: 1840 },
    { table_number: "Bar Area", orders: 82, revenue: 1640 },
    { table_number: "Table 08", orders: 31, revenue: 1200 },
  ] : topTables;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const MiniSparkline = ({ dataKey, color }: { dataKey: string, color: string }) => (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayChartData}>
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={0.2} fill={color} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="relative">
      {/* PREMIUM LOCKED OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[2rem] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"></div>
          
          <div className="relative bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl w-full max-w-lg flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] mb-6 shadow-inner bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-amber-500/40 rotate-3">
              <Crown className="h-10 w-10 -rotate-3" />
            </div>
            <h3 className="text-3xl font-black tracking-tight text-white mb-3 drop-shadow-md">Advanced Analytics</h3>
            <p className="text-sm leading-relaxed text-slate-300 font-medium mb-8 max-w-sm">
              Upgrade to the PRO Plan to unlock high-density real-time dashboards, including AOV, category breakdowns, and conversion funnels.
            </p>
            <button 
              onClick={() => window.location.href = "/dashboard/billing"}
              className="w-full rounded-2xl px-6 py-5 text-sm font-black uppercase tracking-[0.1em] text-slate-900 shadow-2xl transition-all hover:scale-[1.02] bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-amber-500/30"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5" />
                Unlock Analytics
              </span>
            </button>
          </div>
        </div>
      )}

      <div className={isLocked ? "opacity-20 pointer-events-none select-none filter blur-[4px] transition-all duration-1000" : ""}>
        
        {/* DENSE METRICS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Gross Rev</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-black tracking-tighter text-slate-900">{formatCurrency(displayRevenue)}</div>
              <MiniSparkline dataKey="amount" color="#4F46E5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <Receipt className="h-4 w-4" />
              <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Orders</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-black tracking-tighter text-slate-900">{displayOrders}</div>
              <MiniSparkline dataKey="orders" color="#E11D48" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <QrCode className="h-4 w-4" />
              <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Scans</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-black tracking-tighter text-slate-900">{displayScans}</div>
              <MiniSparkline dataKey="scans" color="#D97706" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Avg Order Value</span>
            </div>
            <div className="text-2xl font-black tracking-tighter text-slate-900 mt-1">{formatCurrency(displayAov)}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-cyan-600 mb-1">
              <Crosshair className="h-4 w-4" />
              <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Conversion Rate</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <div className="text-2xl font-black tracking-tighter text-slate-900">{displayConversion.toFixed(1)}%</div>
              <span className="text-[10px] text-slate-400 font-bold">SCAN-TO-ORDER</span>
            </div>
          </div>
        </div>

        {/* 3-COLUMN DENSE GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Revenue Chart - Col Span 2 */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:col-span-2 min-h-[340px]">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue & Traffic</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">7-Day Trajectory</p>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {displayChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F172A" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} tickFormatter={(val) => `$${val}`} />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(val: any) => [formatCurrency(Number(val) || 0), "Revenue"]} />
                    <Area type="monotone" dataKey="amount" stroke="#0F172A" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Revenue Data</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown Donut */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[340px]">
            <div className="mb-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Category Sales</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Revenue Distribution</p>
            </div>
            <div className="flex-1 w-full relative flex items-center justify-center">
              {displayCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={displayCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {displayCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(val: any) => formatCurrency(Number(val))} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Data</p>
                </div>
              )}
              {/* Legend */}
              <div className="absolute bottom-0 left-0 w-full flex flex-wrap justify-center gap-2">
                {displayCategoryData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Selling Items (Col Span 2) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Menu Leaders</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Top items by revenue</p>
              </div>
            </div>

            {displayTopItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayTopItems.slice(0,4).map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{item.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.quantity} units</p>
                    </div>
                    <div className="text-right shrink-0 pr-2">
                      <div className="font-black text-sm text-indigo-600">{formatCurrency(item.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Sales Yet</p>
              </div>
            )}
          </div>

          {/* Table Performance */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Table Traffic</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Highest grossing locations</p>
            </div>
            
            {displayTopTables.length > 0 ? (
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-2">
                {displayTopTables.map((table, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{table.table_number || "Unknown"}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{table.orders} orders</div>
                      </div>
                    </div>
                    <div className="text-right font-black text-sm text-slate-900">
                      {formatCurrency(table.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Table Data</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
