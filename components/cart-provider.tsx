'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CART_STORAGE_KEY, parseCart, type CartItem } from '@/lib/cart';

type CartContextValue = {
  items: CartItem[];
  isReady: boolean;
  storageError: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => boolean;
  setQuantity: (id: number, quantity: number) => boolean;
  removeItem: (id: number) => boolean;
  clearCart: () => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart !== null) setItems(parseCart(savedCart));
      } catch {
        setStorageError('Your saved cart could not be loaded. Please clear the browser storage and try again.');
      } finally {
        setIsReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function saveItems(nextItems: CartItem[]): boolean {
    if (!isReady || storageError) return false;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
      setItems(nextItems);
      return true;
    } catch {
      setStorageError('Your cart could not be saved in this browser. Please check your browser storage settings.');
      return false;
    }
  }

  function addItem(item: Omit<CartItem, 'quantity'>): boolean {
    if (!isReady || storageError) return false;
    const existing = items.find((cartItem) => cartItem.id === item.id);
    const nextItems = existing
      ? items.map((cartItem) => (
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        ))
      : [...items, { ...item, quantity: 1 }];

    return saveItems(nextItems);
  }

  function setQuantity(id: number, quantity: number): boolean {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return false;
    return saveItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
  }

  function removeItem(id: number): boolean {
    return saveItems(items.filter((item) => item.id !== id));
  }

  function clearCart(): boolean {
    return saveItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, isReady, storageError, addItem, setQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider.');
  return context;
}
