'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { CartItem, Product } from '@/types';
import { cartApi } from '@/lib/api';
import { useAuth } from './AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

// Local cart item for guest users (product cached inline)
export interface LocalCartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: LocalCartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;
const TAX_RATE = 0.1;

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Derived totals ──────────────────────────────────────────────────────────
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : items.length > 0 ? SHIPPING_COST : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + shipping;
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const getLocalCart = (): LocalCartItem[] => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  };

  const saveLocalCart = (cartItems: LocalCartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  // ── Sync from backend (authenticated) ───────────────────────────────────────

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems(getLocalCart());
      return;
    }
    setIsLoading(true);
    try {
      const res = await cartApi.get();
      // Map backend cart items (product is populated) to LocalCartItem
      const mapped: LocalCartItem[] = res.data.cart.items.map((item: CartItem) => ({
        product: item.product,
        quantity: item.quantity,
      }));
      setItems(mapped);
    } catch {
      // Fallback to local cart
      setItems(getLocalCart());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load cart on mount / when auth changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        await cartApi.add(product._id, quantity);
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest: manage in localStorage
      const current = getLocalCart();
      const existing = current.find((i) => i.product._id === product._id);
      let updated: LocalCartItem[];
      if (existing) {
        updated = current.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        updated = [...current, { product, quantity }];
      }
      saveLocalCart(updated);
      setItems(updated);
    }
  }, [isAuthenticated, refreshCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        await cartApi.remove(productId);
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    } else {
      const updated = getLocalCart().filter((i) => i.product._id !== productId);
      saveLocalCart(updated);
      setItems(updated);
    }
  }, [isAuthenticated, refreshCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        await cartApi.update(productId, quantity);
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    } else {
      const updated = getLocalCart().map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      );
      saveLocalCart(updated);
      setItems(updated);
    }
  }, [isAuthenticated, refreshCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoading(true);
      try {
        await cartApi.clear();
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      saveLocalCart([]);
      setItems([]);
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        tax,
        shipping,
        total,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
