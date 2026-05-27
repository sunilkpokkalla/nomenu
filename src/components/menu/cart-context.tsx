"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { MenuItem } from "./menu-client-view";

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
    setItems(prev => {
      const existing = prev.find(i => i.menuItem.id === menuItem.id && i.notes === notes);
      if (existing) {
        return prev.map(i => 
          i.menuItem.id === menuItem.id && i.notes === notes
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { menuItem, quantity, notes }];
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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
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
