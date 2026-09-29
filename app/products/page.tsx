import Link from 'next/link';
import { Suspense } from 'react';
import StorefrontFooter from '@/components/storefront-footer';
import StorefrontHeader from '@/components/storefront-header';
import ProductService from '@/services/product-service';
import CatalogSearchForm from './search-form';

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    stock?: string;
    page?: string;
  }>;
};

function productPageUrl(filters: { search?: string; category?: string; stock?: string }, page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.stock) params.set('stock', filters.stock);
  params.set('page', String(page));
  return `/products?${params.toString()}`;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = (params.search ?? '').trim();
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const filters = { search, category: params.category, stock: params.stock };

  const response = await ProductService.getProducts(page, params.category ?? '', params.stock ?? '', search);
  const products = response.success ? response.data.products : [];
  const totalPages = response.success ? response.data.pages : 0;

  return (
    <div className="storefront min-h-screen bg-background text-foreground">
      <StorefrontHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold">Products</h1>
        <Suspense fallback={<p>Loading search…</p>}>
          <CatalogSearchForm key={search} search={search} />
        </Suspense>

        {/* Temporary results and pagination for issue #21. Issue #36 can replace
            this list with product cards and catalog controls; retain URL-backed
            search and carry its parameter through pagination/filter links. */}
        {!response.success ? (
          <p className="mt-6" role="alert">Products could not be loaded.</p>
        ) : products.length === 0 ? (
          <p className="mt-6">No products found.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {products.map((product) => (
              <li key={product.id} className="rounded border border-border p-3">
                {product.title} — {product.price}
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav aria-label="Product pages" className="mt-6 flex items-center gap-4">
            {page > 1 && <Link href={productPageUrl(filters, page - 1)}>Previous</Link>}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={productPageUrl(filters, page + 1)}>Next</Link>}
          </nav>
        )}
      </main>
      <StorefrontFooter />
    </div>
  );
}
