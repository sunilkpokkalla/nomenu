import { CartItem } from "@/components/menu/cart-context";

export function calculateTotalItems(items: CartItem[]): number {
  if (!items || !Array.isArray(items)) return 0;
  
  const validItems = items.filter(i => i.quantity !== undefined && !isNaN(i.quantity));
  return validItems.reduce((sum, item) => sum + item.quantity, 0);
}

export function calculateTotalPrice(items: CartItem[]): number {
  if (!items || !Array.isArray(items)) return 0;
  
  const validItems = items.filter(i => i.quantity !== undefined && !isNaN(i.quantity));
  return validItems.reduce((sum, item) => sum + (Number(item.menuItem.price || 0) * item.quantity), 0);
}
