'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart-provider';

export default function AddToCartButton({
  product,
}: {
  product: { id: number; title: string; price: number; thumbnail: string };
}) {
  const { addItem, isReady, storageError } = useCart();
  const [message, setMessage] = useState('');

  function addToCart() {
    const added = addItem(product);
    setMessage(added ? `${product.title} added to cart.` : 'This item could not be added to your cart.');
  }

  return (
    <div className="mx-4 mb-4">
      <button
        type="button"
        disabled={!isReady || Boolean(storageError)}
        onClick={addToCart}
        className="min-h-11 w-full bg-success px-4 text-sm font-semibold text-background disabled:opacity-70"
      >
        Add to cart
      </button>
      {storageError && <p role="alert" className="mt-2 text-sm text-destructive">{storageError}</p>}
      <p className="sr-only" aria-live="polite">{message}</p>
    </div>
  );
}
