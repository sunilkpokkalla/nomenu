import { calculateTotalItems, calculateTotalPrice } from "../cart-utils";
import { CartItem } from "@/components/menu/cart-context";

describe("Cart Utils", () => {
  const mockItem1: CartItem = {
    menuItem: { id: "1", name: "Burger", price: 10, category_id: "c1", created_at: "", restaurant_id: "r1", is_available: true, sort_order: 1 },
    quantity: 2,
    notes: ""
  };
  
  const mockItem2: CartItem = {
    menuItem: { id: "2", name: "Fries", price: 5, category_id: "c1", created_at: "", restaurant_id: "r1", is_available: true, sort_order: 2 },
    quantity: 1,
    notes: ""
  };

  it("calculates total items correctly", () => {
    expect(calculateTotalItems([])).toBe(0);
    expect(calculateTotalItems([mockItem1])).toBe(2);
    expect(calculateTotalItems([mockItem1, mockItem2])).toBe(3);
  });

  it("calculates total price correctly", () => {
    expect(calculateTotalPrice([])).toBe(0);
    expect(calculateTotalPrice([mockItem1])).toBe(20);
    expect(calculateTotalPrice([mockItem1, mockItem2])).toBe(25);
  });

  it("handles missing quantity safely", () => {
    const brokenItem = { ...mockItem1, quantity: undefined as unknown as number };
    expect(calculateTotalItems([brokenItem])).toBe(0);
    expect(calculateTotalPrice([brokenItem])).toBe(0);
  });
});
