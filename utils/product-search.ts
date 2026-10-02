import type { Product } from '@/app/types';
import { matchesProductQuery as matchesSharedProductQuery } from './product-search-shared.js';

export function matchesProductQuery(product: Pick<Product, 'title' | 'tags' | 'sku' | 'brand' | 'category'>, query: string): boolean {
  return matchesSharedProductQuery(product, query);
}
