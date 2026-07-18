"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "./types";
import { calculateTotalItems, calculateTotalPrice } from "@/lib/cart-utils";

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (menuItem: MenuItem, quantity: number, notes: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItem, quantity: number, notes: string) => {
    // Safety check: ensure quantity is a valid number, otherwise default to 1
    const safeQuantity = isNaN(quantity) || quantity === undefined ? 1 : quantity;
    
    setItems(prev => {
      // Filter out any corrupted items that might be stuck in state
      const cleanPrev = prev.filter(i => i.quantity !== undefined && !isNaN(i.quantity));
      
      const existing = cleanPrev.find(i => i.menuItem.id === menuItem.id && i.notes === notes);
      if (existing) {
        return cleanPrev.map(i => 
          i.menuItem.id === menuItem.id && i.notes === notes
            ? { ...i, quantity: i.quantity + safeQuantity }
            : i
        );
      }
      return [...cleanPrev, { menuItem, quantity: safeQuantity, notes }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev => prev.map(i => i.menuItem.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const validItems = items.filter(i => i.quantity !== undefined && !isNaN(i.quantity));
  const totalItems = calculateTotalItems(items);
  const totalPrice = calculateTotalPrice(items);
  return (
    <CartContext.Provider value={{ items: validItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
