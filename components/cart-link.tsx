'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/components/cart-provider';

export default function CartLink() {
  const { items, isReady, storageError } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
      if (event.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
        const first = focusable?.[0];
        const last = focusable?.[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        aria-label={isReady && itemCount > 0 ? `Shopping cart, ${itemCount} items` : 'Shopping cart'}
        aria-expanded={isOpen}
        aria-controls="shopping-cart-panel"
        onClick={() => setIsOpen(true)}
        className="inline-flex size-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ShoppingCart aria-hidden="true" size={20} />
        {isReady && itemCount > 0 && (
          <span aria-hidden="true" className="ml-1 text-xs font-semibold">{itemCount}</span>
        )}
      </button>

      <div
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <button
          type="button"
          aria-label="Close shopping cart"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 size-full cursor-default"
        />
        <aside
          ref={panelRef}
          id="shopping-cart-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shopping-cart-heading"
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background text-foreground shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <header className="flex items-center justify-between border-b border-border p-5">
            <h2 id="shopping-cart-heading" className="text-xl font-semibold">Your cart</h2>
            <button
              type="button"
              ref={closeRef}
              onClick={() => setIsOpen(false)}
              aria-label="Close shopping cart"
              className="inline-flex size-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <X aria-hidden="true" size={20} />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-5">
            {!isReady ? (
              <p role="status">Loading your cart…</p>
            ) : storageError ? (
              <p role="alert" className="text-destructive">{storageError}</p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-4">
                    <Image src={item.thumbnail} alt="" width={64} height={64} className="size-16 object-contain" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.title}</p>
                      {(item.discountPercentage ?? 0) > 0 && (
                        <span className="mt-1 inline-block rounded-full bg-error px-2 py-0.5 text-xs font-semibold text-background">
                          Sale · {item.discountPercentage}% off
                        </span>
                      )}
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each · Qty {item.quantity}</p>
                    </div>
                    <p className="shrink-0 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {isReady && !storageError && items.length > 0 && (
            <footer className="space-y-4 border-t border-border p-5">
              <p className="flex justify-between text-lg font-semibold">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </p>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex min-h-11 items-center justify-center bg-primary px-5 font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Go to checkout
              </Link>
            </footer>
          )}
        </aside>
      </div>
    </>
  );
}
