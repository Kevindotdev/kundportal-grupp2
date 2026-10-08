import type { Product } from '@/app/types';

export function discountedPrice(product: Pick<Product, 'price' | 'discountPercentage'>): number {
  return product.price * (1 - (product.discountPercentage ?? 0) / 100);
}
