"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConciergeBell, Users, MessageSquare, LayoutDashboard, Wallet, Clock, ChevronLeft, QrCode } from "lucide-react";
import { CashierBoard } from "@/app/dashboard/cashier/cashier-board";
import { WaitlistBoard } from "@/app/dashboard/cashier/waitlist-board";
import { FloorPlanBoard } from "@/app/dashboard/cashier/floor-plan-board";
import { FeedbackList } from "@/app/dashboard/feedback/feedback-list";
import { LoyaltyQrGenerator } from "@/app/dashboard/feedback/loyalty-qr-generator";
import { Database } from "@/types/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FloorPlan = any;

type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  order_items: (Database["public"]["Tables"]["order_items"]["Row"] & {
    menu_items: { name: string; price: number } | null;
  })[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FeedbackData = any;

interface CustomerOpsSliderProps {
  initialOrders: Order[];
  floorPlans: FloorPlan[];
  feedbackData: FeedbackData[];
  restaurantId: string;
  restaurantCreatedAt: string;
  timezone: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  currencySymbol: string;
  userRole: "owner" | "waitstaff" | "kitchen" | "kitchen_waitstaff";
  recoveryOfferText?: string;
}

export function CustomerOpsSlider({
  initialOrders,
  floorPlans,
  feedbackData,
  restaurantId,
  restaurantCreatedAt,
  timezone,
  supabaseUrl,
  supabaseAnonKey,
  currencySymbol,
  userRole,
  recoveryOfferText,
}: CustomerOpsSliderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mainTab, setMainTab] = useState("foh");
  const [fohTab, setFohTab] = useState("floor-plan");

  const dineInOrders = initialOrders.filter((o) => !o.customer_phone);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="h-12 px-6 rounded-2xl bg-white border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all font-bold text-slate-800 flex items-center gap-2"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <ConciergeBell className="h-3.5 w-3.5" />
          </div>
          Customer Ops
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-screen sm:max-w-[100vw] p-0 flex flex-col bg-slate-50 shadow-none border-none [&>button]:hidden">
        <Tabs value={mainTab} onValueChange={setMainTab} className="flex-1 flex flex-col overflow-hidden">
          <SheetHeader className="p-4 sm:px-6 sm:py-4 border-b border-slate-200/50 bg-white flex flex-col xl:flex-row xl:items-center justify-between gap-4">
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
                <ConciergeBell className="h-6 w-6 text-indigo-600" />
                Customer Operations
              </SheetTitle>
              
              <div className="h-6 w-px bg-slate-200 hidden xl:block"></div>
              
              <TabsList className="bg-slate-100 p-1 rounded-xl h-auto inline-flex w-full sm:w-auto">
                <TabsTrigger 
                  value="foh"
                  className="rounded-lg py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 flex-1 sm:flex-none justify-center text-sm transition-all"
                >
                  <Users className="h-4 w-4" />
                  Front of House
                </TabsTrigger>
                <TabsTrigger 
                  value="feedback"
                  className="rounded-lg py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 flex-1 sm:flex-none justify-center text-sm relative transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  Live Feedback
                  {feedbackData && feedbackData.filter(f => f.status !== 'resolved' && f.rating <= 3).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="scanner"
                  className="rounded-lg py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2 flex-1 sm:flex-none justify-center text-sm transition-all"
                >
                  <QrCode className="h-4 w-4" />
                  Staff Scanner
                </TabsTrigger>
              </TabsList>
            </div>

            {mainTab === "foh" && (
              <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner w-full xl:w-auto">
                <Button 
                  variant="ghost"
                  className={`flex-1 xl:flex-none rounded-lg py-1.5 px-3 h-auto text-sm font-bold flex items-center justify-center gap-2 transition-all ${fohTab === "floor-plan" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
                  onClick={() => setFohTab("floor-plan")}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Floor Plan
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 xl:flex-none rounded-lg py-1.5 px-3 h-auto text-sm font-bold flex items-center justify-center gap-2 transition-all ${fohTab === "waitlist" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
                  onClick={() => setFohTab("waitlist")}
                >
                  <Clock className="h-4 w-4" />
                  Waitlist
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 xl:flex-none rounded-lg py-1.5 px-3 h-auto text-sm font-bold flex items-center justify-center gap-2 transition-all ${fohTab === "active" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
                  onClick={() => setFohTab("active")}
                >
                  <Wallet className="h-4 w-4" />
                  Active Tabs
                </Button>
              </div>
            )}
          </SheetHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col relative">
            <TabsContent value="foh" className="absolute inset-0 m-0 border-0 p-0 focus-visible:outline-none outline-none">
              <div className="flex-1 overflow-hidden relative h-full flex flex-col">
                <div className="absolute inset-0">
                  {fohTab === "floor-plan" && floorPlans.length > 0 && (
                    <FloorPlanBoard
                      restaurantId={restaurantId}
                      initialFloorPlans={floorPlans}
                      activeOrders={dineInOrders}
                      userRole={userRole}
                    />
                  )}
                  {fohTab === "waitlist" && (
                    <WaitlistBoard
                      restaurantId={restaurantId}
                      supabaseUrl={supabaseUrl}
                      supabaseAnonKey={supabaseAnonKey}
                      floorPlans={floorPlans}
                      activeOrders={dineInOrders}
                    />
                  )}
                  {fohTab === "active" && (
                    <CashierBoard
                      initialOrders={dineInOrders}
                      restaurantId={restaurantId}
                      restaurantCreatedAt={restaurantCreatedAt}
                      timezone={timezone}
                      supabaseUrl={supabaseUrl}
                      supabaseAnonKey={supabaseAnonKey}
                      currencySymbol={currencySymbol}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="absolute inset-0 m-0 border-0 p-0 focus-visible:outline-none outline-none">
              <div className="flex-1 w-full h-full p-4 sm:p-6 overflow-hidden flex flex-col bg-slate-50/50">
                <FeedbackList 
                  feedbacks={feedbackData} 
                  timezone={timezone} 
                  restaurantId={restaurantId} 
                  restaurantCreatedAt={restaurantCreatedAt}
                  supabaseUrl={supabaseUrl}
                  supabaseAnonKey={supabaseAnonKey}
                  recoveryOfferText={recoveryOfferText}
                />
              </div>
            </TabsContent>

            <TabsContent value="scanner" className="absolute inset-0 m-0 border-0 p-0 focus-visible:outline-none outline-none">
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 overflow-y-auto">
                <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 py-8 flex flex-col items-center justify-center min-h-full">
                  <LoyaltyQrGenerator 
                    restaurantId={restaurantId}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
