"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "./cart-context";
import { ShoppingBag, X, Plus, Minus, CreditCard, UtensilsCrossed, Receipt } from "lucide-react";
import { submitOrder, getOrderReceipt, getSlotAvailability } from "@/app/menu/[id]/actions";
import { getCurrencySymbol } from "@/lib/currency-options";

export function FloatingCart({ restaurantId, menuId, tableNumber, themeStyle, primaryColor, currencySymbol, taxRate = 0, serviceCharge = 0, serviceChargeType = "percentage", stripeAccountId, locationLabel, fulfillmentType, prepTimeMinutes, maxTakeawayPerSlot = 5, maxReservePerSlot = 5, openingTime = "09:00:00", closingTime = "23:00:00", plan, allowManualPayments = false }: {
  restaurantId: string;
  menuId: string;
  tableNumber?: string;
  themeStyle: string;
  primaryColor: string;
  currencySymbol: string;
  taxRate?: number;
  serviceCharge?: number;
  serviceChargeType?: string;
  stripeAccountId?: string | null;
  locationLabel?: string | null;
  fulfillmentType?: string | null;
  prepTimeMinutes?: number;
  maxTakeawayPerSlot?: number;
  maxReservePerSlot?: number;
  openingTime?: string;
  closingTime?: string;
  plan?: string;
  allowManualPayments?: boolean;
}) {
  const searchParams = useSearchParams();
  const urlMode = searchParams?.get('mode');
  let activeFulfillmentType = urlMode === 'pickup' ? 'pickup' : urlMode === 'reserve' ? 'priority_reserve' : 'dine_in';
  
  // Enforce enterprise-only fulfillment modes
  if (plan !== 'enterprise' && activeFulfillmentType !== 'dine_in') {
    activeFulfillmentType = 'dine_in';
  }

  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("ASAP");
  const [tipAmount, setTipAmount] = useState<number | null>(null);

  const [partySize, setPartySize] = useState("");
  const [table, setTable] = useState(tableNumber || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{ id: string, dailyNumber: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [timeSlots, setTimeSlots] = useState<{label: string, value: string}[]>([]);
  const [slotAvailability, setSlotAvailability] = useState<Record<string, { takeawayCount: number; reserveCount: number }>>({});

  useEffect(() => {
    async function loadTimeSlots() {
      if (activeFulfillmentType === 'pickup' || activeFulfillmentType === 'priority_reserve') {
        const slots = [];
        const now = new Date();
        const prep = prepTimeMinutes || 20;
        
        let availability: Record<string, { takeawayCount: number; reserveCount: number }> = {};
        try {
          availability = await getSlotAvailability(restaurantId);
          setSlotAvailability(availability);
        } catch (e) {
          console.error("Failed to load slot availability", e);
        }
        
        const openHours = parseInt(openingTime?.split(':')[0] || "09", 10);
        const openMins = parseInt(openingTime?.split(':')[1] || "00", 10);
        const openTimeDate = new Date(now);
        openTimeDate.setHours(openHours, openMins, 0, 0);

        const closeHours = parseInt(closingTime?.split(':')[0] || "23", 10);
        const closeMins = parseInt(closingTime?.split(':')[1] || "00", 10);
        const endTime = new Date(now);
        endTime.setHours(closeHours, closeMins, 0, 0);

        const closed = now < openTimeDate || now >= endTime;
        setIsClosed(closed);

        let baseTime = now;
        if (now < openTimeDate) {
          baseTime = openTimeDate;
        }

        const startTime = new Date(baseTime.getTime() + prep * 60000);
        const remainder = 15 - (startTime.getMinutes() % 15);
        startTime.setMinutes(startTime.getMinutes() + remainder);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);

        if (activeFulfillmentType === 'pickup' && startTime <= endTime && now >= openTimeDate && !closed) {
          slots.push({
            label: `ASAP (Ready in ~${prep} mins)`,
            value: "ASAP",
          });
        }

        let currentSlot = startTime;
        while (currentSlot <= endTime && !closed) {
          const iso = currentSlot.toISOString();
          const counts = availability[iso] || { takeawayCount: 0, reserveCount: 0 };
          const currentCount = activeFulfillmentType === 'pickup' ? counts.takeawayCount : counts.reserveCount;
          const maxLimit = activeFulfillmentType === 'pickup' ? maxTakeawayPerSlot : maxReservePerSlot;

          if (currentCount < maxLimit) {
            slots.push({
              label: currentSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              value: iso,
            });
          }
          currentSlot = new Date(currentSlot.getTime() + 15 * 60000);
        }
        setTimeSlots(slots);
        
        if (activeFulfillmentType === 'priority_reserve' && slots.length > 0) {
          setPickupTime(slots[0].value);
        }
      }
    }
    loadTimeSlots();
  }, [activeFulfillmentType, prepTimeMinutes, restaurantId, maxTakeawayPerSlot, maxReservePerSlot, openingTime, closingTime]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const fetchReceipt = async () => {
      if (successOrder?.id && successOrder.id !== "Paid Online") {
        const data = await getOrderReceipt(successOrder.id);
        if (data) {
          setReceipt(data);
          // If the webhook hasn't processed yet, poll again
          if (data.status === "awaiting_payment" && !data.payment_intent_id) {
            timeoutId = setTimeout(fetchReceipt, 2000);
          }
        }
      }
    };

    fetchReceipt();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [successOrder]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        const lastOrderId = localStorage.getItem('nomenu_last_order');
        setSuccessOrder({ id: lastOrderId || "Paid Online", dailyNumber: 0 });
        
        // Clean up URL so refresh doesn't trigger it again
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('success');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, []);

  if (totalItems === 0 && !successOrder) return null;

  const handleCheckout = async (e: React.FormEvent | React.MouseEvent, skipStripe = false) => {
    if (e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Prepare items structure
    const orderItems = items.map(i => ({
      menu_item_id: i.menuItem.id,
      quantity: i.quantity,
      price_at_time_of_order: i.menuItem.price,
      customer_notes: i.notes || null,
    }));

    // Calculate totals
    const subtotal = totalPrice;
    const taxAmount = subtotal * (taxRate / 100);
    const serviceFeeAmount = serviceChargeType === "flat" ? serviceCharge : subtotal * (serviceCharge / 100);
    const finalTotal = subtotal + taxAmount + serviceFeeAmount + (tipAmount || 0);

    try {
      // If Stripe is connected and we are not explicitly skipping it
      if (stripeAccountId && !skipStripe) {
        // Generate an order ID so we can track the receipt when they return
        const tempOrderId = crypto.randomUUID();
        localStorage.setItem('nomenu_last_order', tempOrderId);
        
        // Append to multi-order array tracker
        try {
          const existing = JSON.parse(localStorage.getItem('nomenu_orders') || '[]');
          if (!existing.includes(tempOrderId)) {
            localStorage.setItem('nomenu_orders', JSON.stringify([...existing, tempOrderId]));
          }
        } catch(e) {
          localStorage.setItem('nomenu_orders', JSON.stringify([tempOrderId]));
        }

        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId,
            items: items.map(i => ({
              ...i.menuItem,
              quantity: i.quantity,
              notes: i.notes
            })),
            returnUrl: window.location.href, // User comes back to the same menu
            orderId: tempOrderId,
            tableNumber: table || null,
            customerName: customerName || null,
            customerPhone: customerPhone || null,
            reservationTime: pickupTime || null,
            partySize: partySize ? parseInt(partySize, 10) : null,
            tipAmount: tipAmount || 0,
          })
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe
          return;
        } else {
          throw new Error(data.error || "Failed to initialize secure checkout");
        }
      }

      // Fallback: Cash / Pay at Counter (KDS only)
      const res = await submitOrder({
        restaurantId,
        menuId,
        tableNumber: table || null,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        reservationTime: pickupTime || null,
        partySize: partySize ? parseInt(partySize, 10) : null,
        items: orderItems,
        totalAmount: finalTotal,
        tipAmount: tipAmount || 0
      });

      if (res.success && res.orderId) {
        localStorage.setItem('nomenu_last_order', res.orderId);
        
        // Append to multi-order array tracker
        try {
          const existing = JSON.parse(localStorage.getItem('nomenu_orders') || '[]');
          if (!existing.includes(res.orderId)) {
            localStorage.setItem('nomenu_orders', JSON.stringify([...existing, res.orderId]));
          }
        } catch(e) {
          localStorage.setItem('nomenu_orders', JSON.stringify([res.orderId]));
        }

        window.dispatchEvent(new CustomEvent('nomenu_order_placed', { detail: { orderId: res.orderId } }));
        setSuccessOrder({ id: res.orderId, dailyNumber: res.dailyOrderNumber || 0 });
        clearCart();
      } else {
        setError(res.error || "Failed to place order.");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (p: number) => {
    return `${currencySymbol}${p.toFixed(2)}`;
  };

  const getContrastTextColor = (hexColor: string) => {
    if (!hexColor || !hexColor.startsWith("#")) return "#ffffff";
    const hex = hexColor.replace("#", "");
    if (hex.length !== 6 && hex.length !== 3) return "#ffffff";
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const btnColor = themeStyle === "luxury" ? "#F59E0B" : themeStyle === "bistro" ? "#5C4033" : themeStyle === "vibrant" ? "#FF5A5F" : primaryColor;
  const textColor = (themeStyle === "luxury" || themeStyle === "vibrant") ? "#000" : getContrastTextColor(primaryColor);

  // Calculate totals
  const subtotal = totalPrice;
  const taxAmount = subtotal * (taxRate / 100);
  const serviceFeeAmount = serviceChargeType === "flat" ? serviceCharge : subtotal * (serviceCharge / 100);
  const finalTotal = subtotal + taxAmount + serviceFeeAmount + (tipAmount || 0);

  // Success Screen
  if (successOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl my-auto ${
          themeStyle === "luxury" ? "bg-[#0C0C0E] border border-zinc-900 text-zinc-100" : 
          themeStyle === "vibrant" ? "bg-[#FEFCE8] border-4 border-black text-black" : 
          "bg-white text-slate-900"
        }`}>
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
            <UtensilsCrossed className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">{receipt?.payment_intent_id ? "Payment Successful!" : "Order Received!"}</h2>
            <p className="opacity-70 mt-2 font-medium">
              {receipt?.payment_intent_id ? "Your payment was processed and the kitchen is preparing your food." : "The kitchen is preparing your food."}
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-5 flex flex-col gap-4 text-left border border-black/5 dark:border-white/5">
            <div className="flex justify-between items-end border-b border-black/10 dark:border-white/10 pb-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Order Number</div>
                <div className="text-3xl font-black text-amber-500">
                  #{receipt ? String(receipt.daily_order_number).padStart(3, '0') : String(successOrder.dailyNumber).padStart(3, '0')}
                </div>
              </div>
              <div className="flex items-center pb-1">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new Event('nomenu_open_receipts'));
                  }}
                  className="p-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-xl flex items-center gap-2 font-bold text-sm transition-colors print:hidden"
                  title="View Full Receipt"
                >
                  <Receipt className="w-5 h-5" />
                  <span>View Receipt</span>
                </button>
              </div>
            </div>

            {/* Receipt Items */}
            {receipt && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase opacity-50 tracking-wider">Order Summary</div>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {receipt.order_items.map((item: any, idx: number) => {
                    const itemName = Array.isArray(item.menu_items) ? item.menu_items[0]?.name : item.menu_items?.name;
                    return (
                      <div key={idx} className="flex justify-between text-sm font-medium">
                        <span className="flex gap-2">
                          <span className="opacity-60">{item.quantity}x</span>
                          <span>{itemName || 'Item'}</span>
                        </span>
                        <span>{formatPrice(item.price_at_time_of_order * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t border-black/10 dark:border-white/10 pt-3 flex flex-col gap-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">
                      {receipt.is_paid || receipt.payment_intent_id ? "Total Paid" : "To Be Paid"}
                    </span>
                    <span className={`font-black text-lg ${receipt.is_paid || receipt.payment_intent_id ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-500"}`}>
                      {formatPrice(receipt.total_amount)}
                    </span>
                  </div>
                  {!(receipt.is_paid || receipt.payment_intent_id) && (
                    <div className="text-[11px] font-semibold text-center text-amber-700/70 mt-2 bg-amber-500/10 py-1.5 rounded-lg border border-amber-500/20">
                      Please pay at the counter when you finish.
                    </div>
                  )}
                </div>
                
                {receipt.payment_intent_id && (
                  <div className="text-[10px] font-bold text-center opacity-50 mt-2 flex items-center justify-center gap-1">
                    <CreditCard className="w-3 h-3" /> Paid securely via Stripe
                  </div>
                )}
              </div>
            )}
            
            {!receipt && (
              <div className="text-center py-4 opacity-50 animate-pulse text-sm font-bold">
                Loading receipt details...
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSuccessOrder(null);
              setReceipt(null);
              setIsOpen(false);
            }}
            className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]"
          >
            Close & Start New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <button
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto flex items-center justify-between gap-4 px-6 py-4 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 w-full max-w-sm"
            style={{ backgroundColor: btnColor, color: textColor }}
          >
            <div className="flex items-center gap-3 font-bold">
              <div className="bg-white/20 px-2.5 py-1 rounded-full text-sm">
                {totalItems}
              </div>
              <span>View Order</span>
            </div>
            <div className="font-bold">
              {formatPrice(finalTotal)}
            </div>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className={`relative w-full max-w-lg mx-auto sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
            themeStyle === "luxury" ? "bg-[#0C0C0E] border border-zinc-900 text-zinc-100" : 
            themeStyle === "vibrant" ? "bg-[#FEFCE8] border-4 border-black text-black" : 
            "bg-white text-slate-900"
          }`}>
            
            <div className="p-4 border-b flex justify-between items-center bg-black/5">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Order
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b border-black/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>{item.menuItem.name}</span>
                      <span>{formatPrice(item.menuItem.price * item.quantity)}</span>
                    </div>
                    {item.notes && <p className="text-sm opacity-60 italic text-rose-500">Note: {item.notes}</p>}
                  </div>
                  
                  <div className="flex items-center gap-3 bg-black/5 rounded-full px-2 py-1 h-fit">
                    <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="p-1 hover:bg-black/10 rounded-full">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="p-1 hover:bg-black/10 rounded-full">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-6 border-t bg-black/5 space-y-4">
              <div className="space-y-1.5 border-b border-black/10 pb-4">
                <div className="flex justify-between text-sm font-semibold opacity-70">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-sm font-semibold opacity-70">
                    <span>Tax ({taxRate}%)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                )}
                {serviceCharge > 0 && (
                  <div className="flex justify-between text-sm font-semibold opacity-70">
                    <span>Service Fee {serviceChargeType === 'percentage' ? `(${serviceCharge}%)` : ''}</span>
                    <span>{formatPrice(serviceFeeAmount)}</span>
                  </div>
                )}
                {tipAmount ? (
                  <div className="flex justify-between text-sm font-semibold opacity-70">
                    <span>Tip</span>
                    <span>{formatPrice(tipAmount)}</span>
                  </div>
                ) : null}
              </div>
              <div className="flex justify-between font-bold text-xl pt-1">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              {error && <div className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-2 rounded-lg">{error}</div>}

              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold uppercase opacity-60 tracking-wider">Your Name</label>
                    <input 
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. John" 
                      className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                        themeStyle === "luxury"
                          ? "bg-zinc-900 border border-zinc-800 focus:ring-zinc-700 text-white placeholder-zinc-500"
                          : "bg-black/5 border border-black/10 focus:ring-black/20 text-slate-900"
                      }`}
                    />
                  </div>
                  
                  {activeFulfillmentType === 'dine_in' && locationLabel !== 'None' && (
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold uppercase opacity-60 tracking-wider">{locationLabel || "Table"} #</label>
                      <input 
                        required={!tableNumber} // Only require if they didn't scan a table QR
                        value={table}
                        onChange={e => setTable(e.target.value)}
                        placeholder={`e.g. ${locationLabel === 'Room' ? '204' : '12'}`} 
                        className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                        themeStyle === "luxury"
                          ? "bg-zinc-900 border border-zinc-800 focus:ring-zinc-700 text-white placeholder-zinc-500"
                          : "bg-black/5 border border-black/10 focus:ring-black/20 text-slate-900"
                      }`}
                      />
                    </div>
                  )}

                  {(activeFulfillmentType === 'pickup' || activeFulfillmentType === 'priority_reserve') && (
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold uppercase opacity-60 tracking-wider">Phone Number</label>
                      <input 
                        required
                        type="tel"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 555-0198" 
                        className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                        themeStyle === "luxury"
                          ? "bg-zinc-900 border border-zinc-800 focus:ring-zinc-700 text-white placeholder-zinc-500"
                          : "bg-black/5 border border-black/10 focus:ring-black/20 text-slate-900"
                      }`}
                      />
                    </div>
                  )}

                  {activeFulfillmentType === 'pickup' && (
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-bold uppercase opacity-60 tracking-wider">Pickup Time</label>
                      <select 
                        required
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                          themeStyle === "luxury"
                            ? "bg-zinc-900 border border-zinc-800 focus:ring-zinc-700 text-white"
                            : "bg-black/5 border border-black/10 focus:ring-black/20 text-slate-900"
                        }`}
                        disabled={timeSlots.length === 0}
                      >
                        {timeSlots.length === 0 && <option value="">Kitchen Closed</option>}
                        {timeSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeFulfillmentType === 'priority_reserve' && (
                    <>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase opacity-60 tracking-wider">Party Size</label>
                        <input 
                          required
                          type="number"
                          min="1"
                          value={partySize}
                          onChange={e => setPartySize(e.target.value)}
                          placeholder="e.g. 2" 
                          className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                        themeStyle === "luxury"
                          ? "bg-zinc-900 border border-zinc-800 focus:ring-zinc-700 text-white placeholder-zinc-500"
                          : "bg-black/5 border border-black/10 focus:ring-black/20 text-slate-900"
                      }`}
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase opacity-60 tracking-wider">Reservation Time</label>
                        <select 
                          required
                          value={pickupTime}
                          onChange={e => setPickupTime(e.target.value)}
                          className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                          themeStyle === "luxury"
                            ? "bg-zinc-900 border border-zinc-800 focus:ring-zinc-700 text-white"
                            : "bg-black/5 border border-black/10 focus:ring-black/20 text-slate-900"
                        }`}
                          disabled={timeSlots.length === 0}
                        >
                          {timeSlots.length === 0 && <option value="">Kitchen Closed</option>}
                          {timeSlots.map((slot) => (
                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  
                  {plan === 'enterprise' && (
                    <div className="space-y-2 col-span-2 mt-2">
                      <label className="text-xs font-bold uppercase opacity-60 tracking-wider flex justify-between">
                        <span>Add a Tip (Optional)</span>
                        <span className="opacity-50 font-medium normal-case">100% goes to staff</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[15, 18, 20].map((pct) => {
                          const amt = subtotal * (pct / 100);
                          return (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => setTipAmount(amt)}
                              className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                                tipAmount === amt 
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {pct}%
                            </button>
                          );
                        })}
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Other"
                            className="w-full bg-white border border-slate-200 rounded-xl pl-6 pr-2 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-black/20 h-full"
                            onChange={(e) => setTipAmount(e.target.value ? parseFloat(e.target.value) : 0)}
                            onFocus={() => setTipAmount(0)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Main Checkout Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isClosed || (activeFulfillmentType !== 'dine_in' && timeSlots.length === 0)}
                  className="w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  style={{ backgroundColor: btnColor, color: textColor }}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : isClosed ? (
                    "Currently Closed"
                  ) : (activeFulfillmentType !== 'dine_in' && timeSlots.length === 0) ? (
                    "Kitchen Closed"
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {stripeAccountId ? "Secure Checkout" : "Place Order (Pay at Counter)"}
                    </>
                  )}
                </button>

                {/* Optional Manual Payment Button (Enterprise Only) */}
                {allowManualPayments && stripeAccountId && plan === 'enterprise' && (
                  <button
                    type="button"
                    onClick={(e) => handleCheckout(e, true)}
                    disabled={isSubmitting || isClosed || (activeFulfillmentType !== 'dine_in' && timeSlots.length === 0)}
                    className="w-full py-3 mt-2 rounded-xl font-semibold flex justify-center items-center gap-2 bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all disabled:opacity-50 text-sm"
                  >
                    Pay at Counter (Cash / POS)
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
