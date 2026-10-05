import Link from 'next/link';
import { Suspense } from 'react';
import ProductService from '@/services/product-service';
import CategoryService from '@/services/category-service';
import { normalizeCategories, productPageUrl, validatePriceRange } from '@/utils/product-query';
import ProductCard from '@/components/product-card';
import CatalogSearchForm from './search-form';

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string | string[];
    stock?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = (params.search ?? '').trim();
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const categories = normalizeCategories(params.category);
  const inStock = params.inStock === 'true';
  const priceValidation = validatePriceRange(params.minPrice ?? '', params.maxPrice ?? '');
  const hasActiveFilters = Boolean(
    categories.length || params.minPrice || params.maxPrice || inStock || params.stock,
  );
  const filters = {
    search,
    category: categories,
    stock: params.stock,
    sort: params.sort,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    inStock,
  };

  const [response, categoryResponse] = await Promise.all([
    priceValidation.error
      ? Promise.resolve(null)
      : ProductService.getProducts(page, categories, params.stock ?? '', search, {
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          inStock,
        }),
    CategoryService.getAllCategories(),
  ]);
  const products = response?.success ? response.data.products : [];
  const totalPages = response?.success ? response.data.pages : 0;

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-border pb-6">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        {/*
          TODO: #8 Replaces this temporary form with header search.
          Keep the searchParams → ProductService flow for shareable catalog results
          and the remaining filter, pagination, and sorting tickets (#14–15, #21, #37, #44).
        */}
        <Suspense fallback={<p>Loading catalog filters…</p>}>
          <CatalogSearchForm
            key={`${search}:${categories.join(',')}:${params.minPrice ?? ''}:${params.maxPrice ?? ''}:${inStock}`}
            search={search}
            categories={categoryResponse.success ? categoryResponse.data.categories : []}
            selectedCategories={categories}
            minPrice={params.minPrice ?? ''}
            maxPrice={params.maxPrice ?? ''}
            inStock={inStock}
            initialPriceError={priceValidation.error ?? ''}
          />
        </Suspense>

        {priceValidation.error ? null : !response?.success ? (
          <p className="mt-6" role="alert">Products could not be loaded.</p>
        ) : products.length === 0 ? (
          hasActiveFilters ? (
            <div className="mt-6">
              <p>
                {search ? `No products found for “${search}”. Try another product name.` : 'No products match your filters.'}
              </p>
              <Link
                href={productPageUrl('/products', { search, sort: params.sort }, 1)}
                className="mt-2 inline-block underline"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <p className="mt-6">
              {search ? `No products found for “${search}”. Try another product name.` : 'No products found.'}
            </p>
          )
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 2xl:grid-cols-5">
            {products.map((product, index) => (
              <li key={product.id} className="group">
                <ProductCard product={product} eager={index === 0} />
              </li>
            ))}
          </ul>
        )}

        {/* Basic previous/next pagination; issue #37 adds the full catalog controls. */}
        {totalPages > 1 && (
          <nav aria-label="Product pages" className="mt-6 flex items-center gap-4">
            {page > 1 && <Link href={productPageUrl('/products', filters, page - 1)}>Previous</Link>}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={productPageUrl('/products', filters, page + 1)}>Next</Link>}
          </nav>
        )}
      </main>
    </>
  );
}
