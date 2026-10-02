export function normalizeCategories(category?: string | string[]): string[] {
  return (Array.isArray(category) ? category : [category]).filter((value): value is string => Boolean(value));
}

export function validatePriceRange(minPrice: string, maxPrice: string): { error?: string } {
  const isValidPrice = (value: string) =>
    value === '' || (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) && Number.isFinite(Number(value)));

  if (!isValidPrice(minPrice) || !isValidPrice(maxPrice)) {
    return { error: 'Enter a valid price of zero or higher.' };
  }

  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return { error: 'The minimum price must not exceed the maximum price.' };
  }

  return {};
}

export function productPageUrl(
  pathname: '/admin' | '/products',
  filters: {
    search?: string;
    category?: string | string[];
    stock?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: boolean;
  },
  page: number,
) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  for (const category of normalizeCategories(filters.category)) params.append('category', category);
  if (filters.stock) params.set('stock', filters.stock);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.minPrice !== undefined && filters.minPrice !== '') params.set('minPrice', filters.minPrice);
  if (filters.maxPrice !== undefined && filters.maxPrice !== '') params.set('maxPrice', filters.maxPrice);
  if (filters.inStock) params.set('inStock', 'true');
  params.set('page', String(page));
  return `${pathname}?${params.toString()}`;
}
