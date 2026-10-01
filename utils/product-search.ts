import type { Product } from '@/app/types';

export function matchesProductQuery(product: Pick<Product, 'title' | 'tags' | 'sku' | 'brand'>, query: string): boolean {
  const prefix = query.trim().toLowerCase();
  return [product.title, ...(product.tags ?? []), product.sku, product.brand].some((field) =>
    field?.toLowerCase().startsWith(prefix),
  );
}
