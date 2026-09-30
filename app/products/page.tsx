import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Suspense } from 'react';
import ProductService from '@/services/product-service';
import CategoryService from '@/services/category-service';
import { normalizeCategories, productPageUrl, validatePriceRange } from '@/utils/product-query';
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
        <h1 className="mb-6 text-2xl font-bold border-b border-border pb-6">Products</h1>
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
              <p>Inga produkter matchar dina filter</p>
              <Link
                href={productPageUrl('/products', { search, sort: params.sort }, 1)}
                className="mt-2 inline-block underline"
              >
                Rensa filter
              </Link>
            </div>
          ) : (
            <p className="mt-6">No products found.</p>
          )
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 2xl:grid-cols-5">
            {products.map((product, index) => (
              <li key={product.id} className="group">
                <article className="flex h-full flex-col overflow-hidden border border-border bg-surface">
                  <Link
                    href={`/products/${product.id}`}
                    className="block flex-1 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        loading={index === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-7"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground">
                        {product.category?.name ?? 'Uncategorized'}
                      </span>
                      {product.rating !== undefined && (
                        <span
                          role="img"
                          aria-label={`Rated ${product.rating.toFixed(1)} out of 5`}
                          className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs text-foreground"
                        >
                          <Star aria-hidden="true" size={14} className="fill-rating text-rating" />
                          {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-3 p-4">
                      <h2 className="line-clamp-2 min-h-12 flex-1 font-medium leading-6 transition-colors group-hover:text-primary group-hover:underline group-hover:decoration-primary group-hover:underline-offset-4">
                        {product.title}
                      </h2>
                      <p className="shrink-0 font-semibold">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    disabled
                    className="mx-4 mb-4 min-h-11 bg-success px-4 text-sm font-semibold text-background opacity-70"
                  >
                    Add to cart
                  </button>
                </article>
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
