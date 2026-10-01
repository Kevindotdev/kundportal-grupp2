import type { Product } from '@/app/types';

export function matchesProductQuery(product: Pick<Product, 'title' | 'tags' | 'sku' | 'brand' | 'category'>, query: string): boolean {
  const queryWords = query.trim().toLowerCase().split(/\s+/);
  const fields = [product.title, ...(product.tags ?? []), product.sku, product.brand, product.category?.name];

  return fields.some((field) => {
    const words = field?.toLowerCase().split(/\s+/);
    return words?.some((_, index) => queryWords.every((word, offset) => words[index + offset]?.startsWith(word)));
  });
}
