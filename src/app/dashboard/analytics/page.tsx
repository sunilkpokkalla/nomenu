import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsDashboard } from "./analytics-dashboard";

export default async function AnalyticsPage() {
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

  // Fetch scans
  const { data: scans } = await supabase
    .from("menu_scans")
    .select("scanned_at")
    .eq("restaurant_id", restaurant.id);
  
  const totalScans = scans?.length || 0;

  // Fetch orders
  const { data: orders } = await supabase
    .from("orders")
    .select("id, total_amount, table_number, created_at")
    .eq("restaurant_id", restaurant.id)
    .eq("status", "completed");
  
  const ordersList = orders || [];
  const totalOrders = ordersList.length;
  const totalRevenue = ordersList.reduce((acc, order) => acc + Number(order.total_amount), 0);
  
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = totalScans > 0 ? (totalOrders / totalScans) * 100 : 0;

  // Calculate Revenue Over Last 7 Days (for Sparklines & Area Chart)
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const revenueData = last7Days.map((date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayOrders = ordersList.filter((o) => {
      const d = new Date(o.created_at);
      return d >= date && d < nextDay;
    });
    
    const dayScans = scans?.filter(s => {
      if (!s.scanned_at) return false;
      const d = new Date(s.scanned_at);
      return d >= date && d < nextDay;
    }).length || 0;

    const dayRevenue = dayOrders.reduce((acc, order) => acc + Number(order.total_amount), 0);

    return {
      dateStr: weekdays[date.getDay()],
      amount: dayRevenue,
      orders: dayOrders.length,
      scans: dayScans
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
  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      quantity,
      price_at_time_of_order,
      menu_item_id,
      orders!inner(restaurant_id, status)
    `)
    .eq("orders.restaurant_id", restaurant.id)
    .eq("orders.status", "completed");

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

  let topItems = [] as { id: string; name: string; image_url: string; quantity: number; revenue: number }[];
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
        revenueData={revenueData}
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        totalScans={totalScans}
        aov={aov}
        conversionRate={conversionRate}
        topItems={topItems}
        topTables={topTables}
        categoryData={categoryData}
      />
    </div>
  );
}
