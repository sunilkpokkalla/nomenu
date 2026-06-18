import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "./analytics-dashboard";

type PageProps = {
  searchParams: Promise<{ range?: string; date?: string; startDate?: string; endDate?: string }>;
};

export default async function AnalyticsPage(props: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!restaurant) {
    redirect("/dashboard?message=Please%20set%20up%20your%20restaurant%20first");
  }

  const isLocked = !restaurant.plan || restaurant.plan.toLowerCase() === "free";

  const searchParams = await props.searchParams;
  const range = searchParams?.range || "today";
  const dateStr = searchParams?.date;
  const startDateStr = searchParams?.startDate;
  const endDateStr = searchParams?.endDate;

  const now = new Date();
  let startDate: Date;
  let endDate: Date | undefined = undefined;
  
  if (startDateStr && endDateStr) {
    const [sy, sm, sd] = startDateStr.split("-").map(Number);
    startDate = new Date(sy, sm - 1, sd);
    startDate.setHours(0, 0, 0, 0);

    const [ey, em, ed] = endDateStr.split("-").map(Number);
    endDate = new Date(ey, em - 1, ed);
    endDate.setHours(23, 59, 59, 999);
  } else if (dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    startDate = new Date(y, m - 1, d);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
  } else {
    startDate = new Date(now);
    if (range === "today") {
      // startDate is already today, just needs hours reset below
    } else if (range === "yesterday") {
      startDate.setDate(now.getDate() - 1);
      endDate = new Date(now);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
    } else if (range === "7days") {
      startDate.setDate(now.getDate() - 6);
    } else if (range === "month") {
      startDate.setDate(now.getDate() - 29);
    } else if (range === "quarter") {
      startDate.setMonth(now.getMonth() - 3);
    } else if (range === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    startDate.setHours(0, 0, 0, 0);
  }

  // Fetch scans
  let scansQuery = supabase
    .from("menu_scans")
    .select("scanned_at")
    .eq("restaurant_id", restaurant.id)
    .gte("scanned_at", startDate.toISOString());
    
  if (endDate) {
    scansQuery = scansQuery.lt("scanned_at", endDate.toISOString());
  }
  const { data: scans } = await scansQuery;
  
  const totalScans = scans?.length || 0;

  // Fetch orders
  let ordersQuery = supabase
    .from("orders")
    .select("id, total_amount, tip_amount, table_number, created_at")
    .eq("restaurant_id", restaurant.id)
    .eq("status", "completed")
    .gte("created_at", startDate.toISOString());
    
  if (endDate) {
    ordersQuery = ordersQuery.lt("created_at", endDate.toISOString());
  }
  const { data: orders } = await ordersQuery;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ordersList = (orders || []) as any[];
  const totalOrders = ordersList.length;
  const totalRevenue = ordersList.reduce((acc, order) => acc + Number(order.total_amount), 0);
  const totalTips = ordersList.reduce((acc, order) => acc + Number(order.tip_amount || 0), 0);
  
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = totalScans > 0 ? (totalOrders / totalScans) * 100 : 0;

  let buckets: { date: Date; nextDate: Date; label: string }[] = [];

  if (startDateStr && endDateStr && endDate) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) {
      const hours = diffDays * 24;
      buckets = Array.from({ length: hours }, (_, i) => {
        const d = new Date(startDate);
        d.setHours(i);
        const nextD = new Date(d);
        nextD.setHours(i + 1);
        
        const hour12 = d.getHours() === 0 ? 12 : d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
        const ampm = d.getHours() < 12 ? "AM" : "PM";
        const dayLabel = diffDays > 1 ? ` (${d.getMonth() + 1}/${d.getDate()})` : '';
        return { date: d, nextDate: nextD, label: `${hour12}${ampm}${dayLabel}` };
      });
    } else {
      buckets = Array.from({ length: diffDays }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        d.setHours(0, 0, 0, 0);
        const nextD = new Date(d);
        nextD.setDate(nextD.getDate() + 1);
        
        const label = `${d.getMonth() + 1}/${d.getDate()}`;
        return { date: d, nextDate: nextD, label };
      });
    }
  } else if (dateStr || range === "today") {
    const baseDate = dateStr ? new Date(startDate) : new Date(now);
    buckets = Array.from({ length: 24 }, (_, i) => {
      const d = new Date(baseDate);
      d.setHours(0, 0, 0, 0);
      d.setHours(i);
      const nextD = new Date(d);
      nextD.setHours(i + 1);
      
      const hour12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
      const ampm = i < 12 ? "AM" : "PM";
      return { date: d, nextDate: nextD, label: `${hour12}${ampm}` };
    });
  } else if (range === "7days" || range === "month") {
    const days = range === "7days" ? 7 : 30;
    buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (days - 1 - i));
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);
      
      const label = range === "7days" 
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]
        : `${d.getMonth() + 1}/${d.getDate()}`;
        
      return { date: d, nextDate: nextD, label };
    });
  } else if (range === "quarter") {
    buckets = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (11 - i) * 7);
      d.setDate(d.getDate() - d.getDay()); // start of week
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 7);
      return { date: d, nextDate: nextD, label: `Week ${i+1}` };
    });
  } else if (range === "year") {
    buckets = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const nextD = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const label = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
      return { date: d, nextDate: nextD, label };
    });
  }

  const revenueData = buckets.map((bucket) => {
    const dayOrders = ordersList.filter((o) => {
      const d = new Date(o.created_at);
      return d >= bucket.date && d < bucket.nextDate;
    });
    
    const dayScans = scans?.filter(s => {
      if (!s.scanned_at) return false;
      const d = new Date(s.scanned_at);
      return d >= bucket.date && d < bucket.nextDate;
    });

    const dayRevenue = dayOrders.reduce((acc, order) => acc + Number(order.total_amount), 0);

    return {
      dateStr: bucket.label,
      amount: dayRevenue,
      orders: dayOrders.length,
      scans: dayScans?.length || 0
    };
  });

  // Calculate Top Tables
  const tableStats: Record<string, { orders: number; revenue: number }> = {};
  ordersList.forEach(order => {
    const table = order.table_number || "Unknown";
    if (!tableStats[table]) {
      tableStats[table] = { orders: 0, revenue: 0 };
    }
    tableStats[table].orders += 1;
    tableStats[table].revenue += Number(order.total_amount);
  });

  const topTables = Object.entries(tableStats)
    .map(([table_number, stats]) => ({
      table_number,
      ...stats
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Fetch Order Items, Menu Items, and Categories
  let orderItemsQuery = supabase
    .from("order_items")
    .select(`
      quantity,
      price_at_time_of_order,
      menu_item_id,
      orders!inner(restaurant_id, status, created_at)
    `)
    .eq("orders.restaurant_id", restaurant.id)
    .eq("orders.status", "completed")
    .gte("orders.created_at", startDate.toISOString());
    
  if (endDate) {
    orderItemsQuery = orderItemsQuery.lt("orders.created_at", endDate.toISOString());
  }
  const { data: orderItems } = await orderItemsQuery;

  const itemStats: Record<string, { quantity: number; revenue: number }> = {};
  if (orderItems) {
    orderItems.forEach(item => {
      const id = item.menu_item_id;
      if (!itemStats[id]) itemStats[id] = { quantity: 0, revenue: 0 };
      itemStats[id].quantity += item.quantity;
      itemStats[id].revenue += (item.quantity * Number(item.price_at_time_of_order));
    });
  }

  // Get Top 5 item IDs
  const topItemIds = Object.entries(itemStats)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([id]) => id);

  // Get Bottom 5 item IDs (Dead Stock)
  const bottomItemIds = Object.entries(itemStats)
    .sort((a, b) => a[1].revenue - b[1].revenue)
    .slice(0, 5)
    .map(([id]) => id);

  let topItems = [] as { id: string; name: string; image_url: string; quantity: number; revenue: number }[];
  let bottomItems = [] as { id: string; name: string; image_url: string; quantity: number; revenue: number }[];
  let categoryData: { name: string; value: number }[] = [];

  // If we have items sold, we need to join with menu_items to get categories
  if (Object.keys(itemStats).length > 0) {
    // We fetch ALL menu items that have been ordered to build the category chart
    const allOrderedItemIds = Object.keys(itemStats);
    
    const { data: menuItemsData } = await supabase
      .from("menu_items")
      .select("id, name, image_url, category_id")
      .in("id", allOrderedItemIds);

    if (menuItemsData) {
      // Build top items list
      topItems = topItemIds.map(id => {
        const menuItem = menuItemsData.find(m => m.id === id);
        return {
          id,
          name: menuItem?.name || "Unknown Item",
          image_url: menuItem?.image_url || "",
          quantity: itemStats[id].quantity,
          revenue: itemStats[id].revenue
        };
      }).filter(Boolean);

      // Build bottom items list
      bottomItems = bottomItemIds.map(id => {
        const menuItem = menuItemsData.find(m => m.id === id);
        return {
          id,
          name: menuItem?.name || "Unknown Item",
          image_url: menuItem?.image_url || "",
          quantity: itemStats[id].quantity,
          revenue: itemStats[id].revenue
        };
      }).filter(Boolean);

      // Fetch Categories
      const categoryIds = [...new Set(menuItemsData.map(m => m.category_id).filter(Boolean))];
      if (categoryIds.length > 0) {
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", categoryIds);
        
        if (categoriesData) {
          const catRevenue: Record<string, number> = {};
          menuItemsData.forEach(m => {
            if (m.category_id) {
              const catName = categoriesData.find(c => c.id === m.category_id)?.name || "Other";
              if (!catRevenue[catName]) catRevenue[catName] = 0;
              catRevenue[catName] += itemStats[m.id].revenue;
            }
          });

          categoryData = Object.entries(catRevenue)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
        }
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Business Insights</h1>
        <p className="mt-1 text-slate-600 font-medium">
          High-density analytics for revenue, menu performance, and operational efficiency.
        </p>
      </div>

      <AnalyticsDashboard 
        isLocked={isLocked}
        range={range}
        dateStr={dateStr}
        startDateStr={startDateStr}
        endDateStr={endDateStr}
        planType={restaurant.plan || "free"}
        revenueData={revenueData}
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        totalScans={totalScans}
        aov={aov}
        conversionRate={conversionRate}
        topItems={topItems}
        bottomItems={bottomItems}
        topTables={topTables}
        categoryData={categoryData}
        totalTips={totalTips}
      />
    </div>
  );
}
