export function productPageUrl(
  pathname: '/admin' | '/products',
  filters: { search?: string; category?: string; stock?: string },
  page: number,
) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.stock) params.set('stock', filters.stock);
  params.set('page', String(page));
  return `${pathname}?${params.toString()}`;
}
