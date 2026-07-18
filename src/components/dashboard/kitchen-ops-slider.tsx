"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, ShoppingBag, UtensilsCrossed, ChevronLeft } from "lucide-react";
import { OrdersBoard } from "@/app/dashboard/orders/orders-board";
import { TakeawayBoard } from "@/app/dashboard/takeaway/takeaway-board";
import { Database } from "@/types/database";

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items: (Database["public"]["Tables"]["order_items"]["Row"] & {
    menu_items: { name: string; price: number } | null;
  })[];
};

interface KitchenOpsSliderProps {
  initialOrders: Order[];
  restaurantId: string;
  timezone: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function KitchenOpsSlider({
  initialOrders,
  restaurantId,
  timezone,
  supabaseUrl,
  supabaseAnonKey,
}: KitchenOpsSliderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter orders for each board
  const dineInOrders = initialOrders.filter((o) => !o.customer_phone);
  const takeawayOrders = initialOrders.filter((o) => !!o.customer_phone);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="h-12 px-6 rounded-2xl bg-white border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all font-bold text-slate-800 flex items-center gap-2"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <ChefHat className="h-3.5 w-3.5" />
          </div>
          Kitchen Ops
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-screen sm:max-w-[100vw] p-0 flex flex-col bg-slate-50 border-none shadow-none [&>button]:hidden">
        <Tabs defaultValue="dine-in" className="flex-1 flex flex-col overflow-hidden">
          <SheetHeader className="p-4 sm:px-6 sm:py-4 border-b border-slate-200/50 bg-white flex flex-col xl:flex-row xl:items-center justify-between gap-4 z-10 flex-none">
            <div className="flex items-center gap-4 flex-wrap">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)} 
                className="rounded-full hover:bg-slate-100 -ml-2 text-slate-500 hover:text-slate-900"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <SheetTitle className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-orange-600" />
                Kitchen Operations
              </SheetTitle>
              
              <div className="h-6 w-px bg-slate-200 hidden xl:block"></div>
              
              <TabsList className="bg-slate-100 p-1 rounded-xl h-auto inline-flex w-full sm:w-auto">
                <TabsTrigger 
                  value="dine-in"
                  className="rounded-lg py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 flex-1 sm:flex-none justify-center text-sm transition-all"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Priority Dine-In
                </TabsTrigger>
                <TabsTrigger 
                  value="takeaway"
                  className="rounded-lg py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 flex-1 sm:flex-none justify-center text-sm transition-all"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Takeaway
                </TabsTrigger>
              </TabsList>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col relative">
            
            <TabsContent value="dine-in" className="absolute inset-0 m-0 border-0 p-0 focus-visible:outline-none outline-none">
              <div className="absolute inset-0 overflow-y-auto bg-slate-50">
                <OrdersBoard
                  initialOrders={dineInOrders}
                  restaurantId={restaurantId}
                  timezone={timezone}
                  supabaseUrl={supabaseUrl}
                  supabaseAnonKey={supabaseAnonKey}
                  isStandalone={false}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="takeaway" className="absolute inset-0 m-0 border-0 p-0 focus-visible:outline-none outline-none">
              <div className="absolute inset-0 overflow-y-auto bg-slate-50">
                <TakeawayBoard
                  initialOrders={takeawayOrders}
                  restaurantId={restaurantId}
                  timezone={timezone}
                  supabaseUrl={supabaseUrl}
                  supabaseAnonKey={supabaseAnonKey}
                  isStandalone={false}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
