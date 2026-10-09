'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart-provider';
import type { Product } from '@/app/types';
import { discountedPrice } from '@/utils/product-price';
import { cartStockMessage, isCartStockError } from '@/lib/cart-stock';

export default function AddToCartButton({
  product,
  disabled = false,
  disabledLabel = 'Out of stock',
  className = 'mx-4 mb-4',
}: {
  product: Pick<Product, 'id' | 'title' | 'price' | 'discountPercentage' | 'thumbnail' | 'stock' | 'availabilityStatus'>;
  disabled?: boolean;
  disabledLabel?: string;
  className?: string;
}) {
  const { addItem, items, isReady, storageError } = useCart();
  const [message, setMessage] = useState('');
  const [isStockError, setIsStockError] = useState(false);
  const existingItem = items.find((item) => item.id === product.id);
  const stock = product.availabilityStatus?.toLowerCase() === 'out of stock' ? 0 : product.stock ?? existingItem?.stock;
  const reachedStockLimit = stock !== undefined && existingItem !== undefined && existingItem.quantity >= stock;

  function addToCart() {
    const { availabilityStatus, ...cartProduct } = product;
    const submittedStock = availabilityStatus?.toLowerCase() === 'out of stock' ? 0 : stock;
    const result = addItem({ ...cartProduct, stock: submittedStock, price: discountedPrice(product) });
    const stockError = isCartStockError(result);
    setIsStockError(stockError);
    setMessage(
      result === 'success'
        ? `${product.title} added to cart.`
        : stockError
          ? cartStockMessage(result, submittedStock)
          : 'This item could not be added to your cart.',
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={!isReady || Boolean(storageError) || disabled || reachedStockLimit}
        onClick={addToCart}
        className="min-h-11 w-full bg-success px-4 text-sm font-semibold text-background transition-colors duration-150 enabled:cursor-pointer enabled:hover:bg-success-hover enabled:active:bg-success disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {disabled ? disabledLabel : reachedStockLimit ? cartStockMessage('stock-limit', stock) : 'Add to cart'}
      </button>
      {storageError && <p role="alert" className="mt-2 text-sm text-destructive">{storageError}</p>}
      <p role={isStockError ? 'alert' : 'status'} aria-live="polite" className={isStockError ? 'mt-2 text-sm text-destructive' : 'sr-only'}>{message}</p>
    </div>
  );
}
