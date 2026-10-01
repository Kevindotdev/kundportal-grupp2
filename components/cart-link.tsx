'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart-provider';

export default function CartLink() {
  const { items, isReady } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/checkout"
      aria-label={isReady && itemCount > 0 ? `Shopping cart, ${itemCount} items` : 'Shopping cart'}
      className="inline-flex size-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <ShoppingCart aria-hidden="true" size={20} />
      {isReady && itemCount > 0 && (
        <span aria-hidden="true" className="ml-1 text-xs font-semibold">{itemCount}</span>
      )}
    </Link>
  );
}
