export function productPageUrl(
  pathname: '/admin' | '/products',
  filters: { search?: string; category?: string | string[]; stock?: string; sort?: string },
  page: number,
) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  const categories = Array.isArray(filters.category) ? filters.category : [filters.category];
  for (const category of categories) {
    if (category) params.append('category', category);
  }
  if (filters.stock) params.set('stock', filters.stock);
  if (filters.sort) params.set('sort', filters.sort);
  params.set('page', String(page));
  return `${pathname}?${params.toString()}`;
}
