"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalCents: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((entry) => entry.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.productId === item.productId
                  ? { ...entry, quantity: entry.quantity + quantity }
                  : entry,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clearCart: () => set({ items: [] }),
      totalCents: () =>
        get().items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
    }),
    {
      name: "petnexus-cart",
    },
  ),
);
