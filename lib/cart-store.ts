import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CART_STORAGE_KEY, parseCart, type CartItem } from '@/lib/cart';

let persistenceError = false;

type CartState = {
  items: CartItem[];
  isReady: boolean;
  storageError: string | null;
  setReady: () => void;
  setStorageError: (message: string) => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => boolean;
  setQuantity: (id: number, quantity: number) => boolean;
  removeItem: (id: number) => boolean;
  clearCart: () => boolean;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      function saveItems(items: CartItem[]) {
        const previousItems = get().items;
        try {
          set({ items });
          return true;
        } catch {
          persistenceError = true;
          set({ items: previousItems, storageError: 'Your cart could not be saved in this browser. Please check your browser storage settings.' });
          return false;
        }
      }

      return {
        items: [],
        isReady: false,
        storageError: null,
        setReady: () => set({ isReady: true }),
        setStorageError: (storageError) => {
          persistenceError = true;
          set({ storageError });
        },
        addItem: (item) => {
          const { items, isReady, storageError } = get();
          if (!isReady || storageError) return false;
          const existing = items.find((cartItem) => cartItem.id === item.id);
          return saveItems(existing
            ? items.map((cartItem) => (
                cartItem.id === item.id ? { ...cartItem, ...item, quantity: cartItem.quantity + 1 } : cartItem
              ))
            : [...items, { ...item, quantity: 1 }]);
        },
        setQuantity: (id, quantity) => {
          const { isReady, items, storageError } = get();
          if (!isReady || !Number.isSafeInteger(quantity) || quantity < 1 || storageError) return false;
          return saveItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
        },
        removeItem: (id) => {
          const { isReady, items, storageError } = get();
          if (!isReady || storageError) return false;
          return saveItems(items.filter((item) => item.id !== id));
        },
        clearCart: () => {
          if (!get().isReady || get().storageError) return false;
          return saveItems([]);
        },
      };
    },
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const saved = localStorage.getItem(name);
          if (saved === null) return null;
          const parsed: unknown = JSON.parse(saved);
          return JSON.stringify(Array.isArray(parsed) ? { state: { items: parseCart(saved) }, version: 0 } : parsed);
        },
        setItem: (name, value) => {
          if (!persistenceError) localStorage.setItem(name, value);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      skipHydration: true,
      partialize: ({ items }) => ({ items }),
      merge: (persistedState, currentState) => {
        if (persistedState === undefined) return currentState;
        if (typeof persistedState !== 'object' || persistedState === null || !('items' in persistedState)) {
          throw new Error('Saved cart data is invalid.');
        }
        return { ...currentState, items: parseCart(JSON.stringify(persistedState.items)) };
      },
      onRehydrateStorage: () => (_state, error) => {
        const state = useCartStore.getState();
        if (error) state.setStorageError('Your saved cart could not be loaded. Please clear the browser storage and try again.');
        state.setReady();
      },
    },
  ),
);
