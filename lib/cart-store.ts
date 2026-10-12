import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CART_STORAGE_KEY, parseCart, type CartItem } from '@/lib/cart';
import { checkCartStock, type CartStockError } from '@/lib/cart-stock';

let persistenceError = false;

type CartState = {
  items: CartItem[];
  isReady: boolean;
  storageError: string | null;
  setReady: () => void;
  setStorageError: (message: string) => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => CartActionResult;
  setQuantity: (id: number, quantity: number) => CartActionResult;
  removeItem: (id: number) => boolean;
  clearCart: () => boolean;
};

type CartActionResult = 'success' | CartStockError | 'failed';

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
          if (!isReady || storageError) return 'failed';
          const existing = items.find((cartItem) => cartItem.id === item.id);
          const stock = item.stock ?? existing?.stock;
          const currentQuantity = existing?.quantity ?? 0;
          const stockError = checkCartStock(stock, currentQuantity + 1, currentQuantity);
          if (stockError) {
            if (existing && item.stock !== undefined && Number.isSafeInteger(item.stock) && item.stock >= 0 && item.stock !== existing.stock) {
              const updatedItems = items.map((cartItem) => (
                cartItem.id === item.id ? { ...cartItem, stock: item.stock } : cartItem
              ));
              if (!saveItems(updatedItems)) return 'failed';
            }
            return stockError;
          }
          const nextItems = existing
            ? items.map((cartItem) => (
                cartItem.id === item.id ? { ...cartItem, ...item, stock, quantity: cartItem.quantity + 1 } : cartItem
              ))
            : [...items, { ...item, stock, quantity: 1 }];
          return saveItems(nextItems) ? 'success' : 'failed';
        },
        setQuantity: (id, quantity) => {
          const { isReady, items, storageError } = get();
          const cartItem = items.find((item) => item.id === id);
          if (!isReady || !Number.isSafeInteger(quantity) || quantity < 1 || storageError || !cartItem) return 'failed';
          const stockError = checkCartStock(cartItem.stock, quantity, cartItem.quantity);
          if (stockError) return stockError;
          return saveItems(items.map((item) => (item.id === id ? { ...item, quantity } : item))) ? 'success' : 'failed';
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
