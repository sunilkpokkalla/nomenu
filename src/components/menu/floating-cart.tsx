"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { ShoppingBag, X, Plus, Minus, CreditCard, UtensilsCrossed } from "lucide-react";
import { submitOrder, getOrderReceipt } from "@/app/menu/[id]/actions";

export function FloatingCart({ restaurantId, menuId, tableNumber, themeStyle, primaryColor, currencySymbol, taxRate = 0, serviceCharge = 0, serviceChargeType = "percentage", stripeAccountId, locationLabel }: {
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
}) {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [table, setTable] = useState(tableNumber || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{ id: string, dailyNumber: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
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
    const finalTotal = subtotal + taxAmount + serviceFeeAmount;

    try {
      // If Stripe is connected, route to Stripe Checkout
      if (stripeAccountId) {
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
      const orderItems = items.map(i => ({
        menu_item_id: i.menuItem.id,
        quantity: i.quantity,
        price_at_time_of_order: i.menuItem.price,
        customer_notes: i.notes || null,
      }));

      const res = await submitOrder({
        restaurantId,
        menuId,
        tableNumber: table || null,
        customerName: customerName || null,
        totalAmount: totalPrice,
        items: orderItems
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
    return `${currencySymbol === "EUR" ? "€" : currencySymbol === "GBP" ? "£" : "$"}${p.toFixed(2)}`;
  };

  const btnColor = themeStyle === "luxury" ? "#F59E0B" : themeStyle === "bistro" ? "#5C4033" : themeStyle === "vibrant" ? "#FF5A5F" : primaryColor;
  const textColor = (themeStyle === "luxury" || themeStyle === "vibrant") ? "#000" : "#fff";

  // Calculate totals
  const subtotal = totalPrice;
  const taxAmount = subtotal * (taxRate / 100);
  const serviceFeeAmount = serviceChargeType === "flat" ? serviceCharge : subtotal * (serviceCharge / 100);
  const finalTotal = subtotal + taxAmount + serviceFeeAmount;

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
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Status</div>
                <div className="text-sm font-bold bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md">
                  {receipt?.status === 'pending' ? 'Pending' : receipt?.status || 'Processing...'}
                </div>
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
                
                <div className="border-t border-black/10 dark:border-white/10 pt-3 flex justify-between items-center mt-2">
                  <span className="font-bold">Total Paid</span>
                  <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                    {formatPrice(receipt.total_amount)}
                  </span>
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
              </div>
              <div className="flex justify-between font-bold text-xl pt-1">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              {error && <div className="text-rose-500 text-sm font-bold text-center bg-rose-50 p-2 rounded-lg">{error}</div>}

              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase opacity-60 tracking-wider">Your Name</label>
                    <input 
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. John" 
                      className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase opacity-60 tracking-wider">{locationLabel || "Table"} #</label>
                    <input 
                      required={!tableNumber} // Only require if they didn't scan a table QR
                      value={table}
                      onChange={e => setTable(e.target.value)}
                      placeholder={`e.g. ${locationLabel === 'Room' ? '204' : '12'}`} 
                      className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  style={{ backgroundColor: btnColor, color: textColor }}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {stripeAccountId ? "Secure Checkout" : "Place Order (Pay at Counter)"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
