"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  LineChart,
} from "recharts";
import { format, subDays, startOfWeek, addDays, subMonths, isAfter, isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Star, TrendingUp, MessageSquare, Calendar } from "lucide-react";

export interface FeedbackData {
  id: string;
  rating: number;
  comment?: string | null;
  customer_name?: string | null;
  contact_info?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  table_number?: string | null;
  created_at: string;
  is_public?: boolean;
  status?: string;
  recovery_request?: string | null;
  recovery_offer_given?: string | null;
  qr_codes?: { label: string | null; location_zone?: string | null } | null;
  loyalty_cards?: {
    id: string;
    stamps: number;
    last_stamp_at: string;
  }[] | null;
}

export function FeedbackAnalytics({
  feedbacks,
  timezone,
}: {
  feedbacks: FeedbackData[];
  timezone: string;
}) {
  const [historyRange, setHistoryRange] = useState(6);

  const tz = timezone || "UTC";

  // Data Aggregation
  const {
    totalFeedback,
    totalLastWeek,
    avgRating,
    avgRatingLastWeek,
    positivePercent,
    positivePercentLastWeek,
    bestDay,
    dailyChartData,
    weeklyChartData,
    historyChartData,
  } = useMemo(() => {
    const now = new Date();
    const zonedNow = toZonedTime(now, tz);

    // Filter valid feedbacks
    const validFeedbacks = feedbacks.filter((f) => f.created_at);

    // Summary Stats & vs Last Week
    const currentWeekStart = startOfWeek(zonedNow, { weekStartsOn: 1 }); // Monday
    const lastWeekStart = subDays(currentWeekStart, 7);
    const lastWeekEnd = subDays(currentWeekStart, 1);

    const currentWeekFeedbacks = validFeedbacks.filter((f) => {
      const d = toZonedTime(new Date(f.created_at), tz);
      return d >= currentWeekStart;
    });

    const lastWeekFeedbacks = validFeedbacks.filter((f) => {
      const d = toZonedTime(new Date(f.created_at), tz);
      return d >= lastWeekStart && d <= lastWeekEnd;
    });

    const calcAvg = (arr: FeedbackData[]) =>
      arr.length > 0 ? arr.reduce((acc, f) => acc + f.rating, 0) / arr.length : 0;
    const calcPos = (arr: FeedbackData[]) =>
      arr.length > 0 ? (arr.filter((f) => f.rating >= 4).length / arr.length) * 100 : 0;

    const totalFeedback = validFeedbacks.length;
    const totalLastWeek = lastWeekFeedbacks.length;
    
    const avgRating = calcAvg(validFeedbacks).toFixed(1);
    const avgRatingLastWeek = calcAvg(lastWeekFeedbacks).toFixed(1);
    
    const positivePercent = Math.round(calcPos(validFeedbacks));
    const positivePercentLastWeek = Math.round(calcPos(lastWeekFeedbacks));

    // Best Day of Week
    const daysMap: Record<number, { count: number; sum: number }> = {};
    validFeedbacks.forEach((f) => {
      const d = toZonedTime(new Date(f.created_at), tz);
      const day = d.getDay(); // 0 = Sun, 1 = Mon, etc.
      if (!daysMap[day]) daysMap[day] = { count: 0, sum: 0 };
      daysMap[day].count += 1;
      daysMap[day].sum += f.rating;
    });
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let bestDay = "N/A";
    let highestAvg = 0;
    Object.keys(daysMap).forEach((d) => {
      const { count, sum } = daysMap[parseInt(d)];
      if (count > 0 && sum / count > highestAvg) {
        highestAvg = sum / count;
        bestDay = dayNames[parseInt(d)];
      }
    });

    // Keywords calculation removed
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, "0")}:00`,
      count: 0,
      sum: 0,
      avg: 0,
    }));
    validFeedbacks.forEach((f) => {
      const d = toZonedTime(new Date(f.created_at), tz);
      if (isSameDay(d, zonedNow)) {
        const h = d.getHours();
        hourlyData[h].count += 1;
        hourlyData[h].sum += f.rating;
        hourlyData[h].avg = hourlyData[h].sum / hourlyData[h].count;
      }
    });

    // Weekly Chart (Current Week)
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(currentWeekStart, i);
      return {
        date: day,
        dayStr: format(day, "EEE"),
        positive: 0,
        negative: 0,
        sum: 0,
        count: 0,
        avg: 0,
      };
    });
    currentWeekFeedbacks.forEach((f) => {
      const d = toZonedTime(new Date(f.created_at), tz);
      const idx = d.getDay() === 0 ? 6 : d.getDay() - 1; // Mon = 0, Sun = 6
      if (idx >= 0 && idx < 7) {
        if (f.rating >= 4) weekData[idx].positive += 1;
        else weekData[idx].negative += 1;
        weekData[idx].sum += f.rating;
        weekData[idx].count += 1;
        weekData[idx].avg = weekData[idx].sum / weekData[idx].count;
      }
    });

    // History Trends
    const historyStart = subMonths(zonedNow, historyRange);
    const monthsMap: Record<string, { positive: number; negative: number; sum: number; count: number; avg: number }> = {};
    validFeedbacks.forEach((f) => {
      const d = toZonedTime(new Date(f.created_at), tz);
      if (isAfter(d, historyStart)) {
        const m = format(d, "MMM yyyy");
        if (!monthsMap[m]) monthsMap[m] = { positive: 0, negative: 0, sum: 0, count: 0, avg: 0 };
        if (f.rating >= 4) monthsMap[m].positive += 1;
        else monthsMap[m].negative += 1;
        monthsMap[m].sum += f.rating;
        monthsMap[m].count += 1;
        monthsMap[m].avg = monthsMap[m].sum / monthsMap[m].count;
      }
    });
    // Order months chronologically by recreating them
    const historyChartData = [];
    for (let i = historyRange - 1; i >= 0; i--) {
      const m = format(subMonths(zonedNow, i), "MMM yyyy");
      historyChartData.push({
        month: m,
        count: monthsMap[m]?.count || 0,
        avg: monthsMap[m]?.avg || 0,
        sentiment: monthsMap[m]?.count > 0 ? (monthsMap[m].positive / monthsMap[m].count) * 100 : 0,
      });
    }

    return {
      totalFeedback,
      totalLastWeek,
      avgRating,
      avgRatingLastWeek,
      positivePercent,
      positivePercentLastWeek,
      bestDay,
      dailyChartData: hourlyData,
      weeklyChartData: weekData,
      historyChartData,
    };
  }, [feedbacks, tz, historyRange]);

  const diffTotal = totalFeedback - totalLastWeek; // Wait, total vs last week total doesn't make sense if total is all-time.
  // Actually, total is all-time. The prompt says "Add: 'vs last week' comparison on each stat card".
  // This probably means "Current week's new feedback vs Last week's new feedback".
  const currentWeekNew = feedbacks.filter((f) => toZonedTime(new Date(f.created_at), tz) >= startOfWeek(toZonedTime(new Date(), tz), { weekStartsOn: 1 })).length;
  const diffNew = currentWeekNew - totalLastWeek;
  
  const diffAvg = (parseFloat(avgRating) - parseFloat(avgRatingLastWeek)).toFixed(1);
  const diffPos = positivePercent - positivePercentLastWeek;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 mb-8">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-600">Total Feedback</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalFeedback}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">New this week: {currentWeekNew}</span>
            <span className={`text-xs font-bold ${diffNew >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {diffNew >= 0 ? "+" : ""}{diffNew} vs last wk
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <h3 className="font-medium text-slate-600">Average Rating</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900 flex items-baseline gap-2">
              {avgRating} <span className="text-sm font-medium text-slate-500">/ 5.0</span>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Best Day: {bestDay}</span>
            <span className={`text-xs font-bold ${parseFloat(diffAvg) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {parseFloat(diffAvg) >= 0 ? "+" : ""}{diffAvg} vs last wk
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-slate-600">Positive Sentiment</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{positivePercent}%</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">4 & 5 Stars</span>
            <span className={`text-xs font-bold ${diffPos >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {diffPos >= 0 ? "+" : ""}{diffPos}% vs last wk
            </span>
          </div>
        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Chart */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Today&apos;s Activity</h3>
            <p className="text-xs text-slate-500 font-medium">Hourly feedback count and average rating.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <ComposedChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} interval={3} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar yAxisId="left" dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Feedback Count" maxBarSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }} name="Avg Rating" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 text-lg">This Week&apos;s Sentiment</h3>
            <p className="text-xs text-slate-500 font-medium">Positive vs Negative feedback per day.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <ComposedChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dayStr" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar yAxisId="left" dataKey="positive" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} name="Positive (4-5)" maxBarSize={40} />
                <Bar yAxisId="left" dataKey="negative" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Neutral/Neg (1-3)" maxBarSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }} name="Avg Rating" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">History & Trends</h3>
            <p className="text-xs text-slate-500 font-medium">Long-term feedback volume and sentiment score.</p>
          </div>
          <select 
            className="border-slate-200 bg-slate-50 text-sm rounded-lg focus:ring-primary focus:border-primary px-3 py-2 text-slate-700 font-medium"
            value={historyRange}
            onChange={(e) => setHistoryRange(Number(e.target.value))}
          >
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last 12 Months</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <ComposedChart data={historyChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
              <Tooltip 
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar yAxisId="left" dataKey="count" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Total Feedback" maxBarSize={60} />
              <Line yAxisId="right" type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} name="Positivity Score (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
