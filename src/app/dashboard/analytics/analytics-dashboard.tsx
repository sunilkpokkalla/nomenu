"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, ShoppingBag, Crown, QrCode, Sparkles, Receipt, Crosshair, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AnalyticsDashboardProps {
  isLocked: boolean;
  range: string;
  dateStr?: string;
  startDateStr?: string;
  endDateStr?: string;
  revenueData: { dateStr: string; amount: number; orders: number; scans: number }[];
  totalRevenue: number;
  totalOrders: number;
  totalScans: number;
  aov: number;
  conversionRate: number;
  topItems: { id: string; name: string; image_url: string; quantity: number; revenue: number }[];
  topTables: { table_number: string; orders: number; revenue: number }[];
  categoryData: { name: string; value: number }[];
  planType?: string;
  totalFeedbacks?: number;
  averageRating?: number;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AnalyticsDashboard({
  isLocked,
  range,
  dateStr,
  startDateStr,
  endDateStr,
  revenueData,
  totalRevenue,
  totalOrders,
  totalScans,
  aov,
  conversionRate,
  topItems,
  topTables,
  categoryData,
  planType,
  totalFeedbacks,
  averageRating
}: AnalyticsDashboardProps) {
  const router = useRouter();

  // We don't need fake data anymore
  const displayRevenue = totalRevenue;
  const displayOrders = totalOrders;
  const displayScans = totalScans;
  const displayAov = aov;
  const displayConversion = conversionRate;
  
  const displayChartData = revenueData;
  const displayCategoryData = categoryData;
  const displayTopItems = topItems;
  const displayTopTables = topTables;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const isPro = planType?.toLowerCase() === "pro";

  const MiniSparkline = ({ dataKey, color }: { dataKey: string, color: string }) => (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayChartData}>
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={0.05} fill={color} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  if (isLocked) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm max-w-2xl mx-auto mt-12">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <TrendingUp className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Upgrade to Pro</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Advanced analytics, real-time revenue tracking, and conversion funnels are exclusively available on the Pro plan. Upgrade to unlock business insights.
        </p>
        <button 
          onClick={() => window.location.href = "/dashboard/billing"}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02]"
        >
          View Pricing Plans
        </button>
      </div>
    );
  }

  const hasData = totalScans > 0 || totalOrders > 0;

  if (!hasData) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm max-w-2xl mx-auto mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative z-10">
          <Sparkles className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">You're Ready to Grow</h2>
        <p className="text-slate-600 mb-8 leading-relaxed max-w-md mx-auto relative z-10">
          Your Pro analytics dashboard is active and waiting for data. Once your customers start scanning QR codes and placing orders, real-time insights will appear here.
        </p>
        <div className="flex gap-4 justify-center relative z-10">
          <button 
            onClick={() => router.push("/dashboard/qrcodes")}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02]"
          >
            Generate QR Codes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
        
        {/* TIME RANGE SELECTOR */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex flex-wrap items-center gap-2 justify-end">
            {/* Custom Date Range Picker */}
            <div className="relative inline-flex items-center gap-2">
              <input
                type="date"
                value={startDateStr || dateStr || ""}
                onChange={(e) => {
                  if (e.target.value) {
                    if (endDateStr) {
                      router.push(`?startDate=${e.target.value}&endDate=${endDateStr}`);
                    } else {
                      router.push(`?date=${e.target.value}`);
                    }
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  (dateStr || startDateStr) ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              />
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">to</span>
              <input
                type="date"
                value={endDateStr || dateStr || ""}
                onChange={(e) => {
                  if (e.target.value) {
                    const start = startDateStr || dateStr || e.target.value;
                    router.push(`?startDate=${start}&endDate=${e.target.value}`);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  (endDateStr || dateStr) ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              />
            </div>
            
            {/* Quick Filters */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/50">
              {(["today", "7days", "month", "quarter", "year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => router.push(`?range=${r}`)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${(!dateStr && !startDateStr && !endDateStr && range === r) ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {r === "today" ? "Today" : r === "7days" ? "7 Days" : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DENSE METRICS STRIP */}
        <div className={`grid gap-4 mb-6 ${isPro ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-5'}`}>
          
          {!isPro && (
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
          )}

          {!isPro && (
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
          )}

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

          {!isPro ? (
            <>
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
            </>
          ) : (
            <>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Feedback</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-black tracking-tighter text-slate-900">{totalFeedbacks || 0}</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Avg Rating</span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-black tracking-tighter text-slate-900">{averageRating ? averageRating.toFixed(1) : "0.0"} <span className="text-sm font-medium text-slate-400">/ 5.0</span></div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* 3-COLUMN DENSE GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Revenue/Scans Chart */}
          <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[340px] ${isPro ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{isPro ? "Traffic Analysis" : "Revenue & Traffic"}</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">7-Day Trajectory</p>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {displayChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {!isPro && (
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F172A" stopOpacity={0.05}/>
                          <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                        </linearGradient>
                      )}
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97706" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                    <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} tickFormatter={(val) => isPro ? val : `$${val}`} />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} formatter={(val: any, name: any) => [name === "amount" ? formatCurrency(Number(val) || 0) : val, name === "amount" ? "Revenue" : "Scans"]} />
                    
                    {!isPro && (
                      <Area type="monotone" dataKey="amount" name="amount" stroke="#0F172A" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" animationDuration={1000} />
                    )}
                    <Area type="monotone" dataKey="scans" name="scans" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Data</p>
                </div>
              )}
            </div>
          </div>

          {!isPro && (
            <>
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
                          contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} 
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
            </>
          )}

      </div>
    </div>
  );
}
