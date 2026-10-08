import Link from 'next/link';
import { Suspense } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const catalogPageSize = 20;

function ProductPagination({ page, totalPages, filters, scrollToBottom = false }: {
  page: number;
  totalPages: number;
  filters: Parameters<typeof productPageUrl>[1];
  scrollToBottom?: boolean;
}) {
  const buttonClass = 'inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const arrowClass = 'inline-flex h-10 w-10 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const disabledClass = 'inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md border border-border text-sm text-muted-foreground';
  const disabledArrowClass = 'inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md border border-border text-muted-foreground';
  const middleStart = Math.max(2, Math.min(page - 1, totalPages - 3));
  const pageNumbers = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : [1, middleStart, middleStart + 1, middleStart + 2, totalPages];
  const pageHref = (pageNumber: number) => `${productPageUrl('/products', filters, pageNumber)}${scrollToBottom ? '#pg-btm' : ''}`;

  return (
    <nav aria-label="Product pages" className="my-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
      <span className="sr-only">Page {page} of {totalPages}</span>
      {page > 1 ? (
        <Link aria-label="Previous page" className={arrowClass} href={pageHref(page - 1)} scroll={scrollToBottom}>
          <ChevronLeft aria-hidden="true" size={18} />
        </Link>
      ) : (
        <span aria-disabled="true" aria-label="Previous page" className={disabledArrowClass}>
          <ChevronLeft aria-hidden="true" size={18} />
        </span>
      )}
      {pageNumbers.map((pageNumber) => (
        pageNumber === page ? (
          <span key={pageNumber} aria-current="page" aria-label={`Page ${pageNumber}`} className={`${disabledClass} bg-primary text-primary-foreground`}>
            {pageNumber}
          </span>
        ) : (
          <Link key={pageNumber} aria-label={`Go to page ${pageNumber}`} className={buttonClass} href={pageHref(pageNumber)} scroll={scrollToBottom}>
            {pageNumber}
          </Link>
        )
      ))}
      {page < totalPages ? (
        <Link aria-label="Next page" className={arrowClass} href={pageHref(page + 1)} scroll={scrollToBottom}>
          <ChevronRight aria-hidden="true" size={18} />
        </Link>
      ) : (
        <span aria-disabled="true" aria-label="Next page" className={disabledArrowClass}>
          <ChevronRight aria-hidden="true" size={18} />
        </span>
      )}
    </nav>
  );
}

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
        }, catalogPageSize),
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
                href={productPageUrl('/products', { search, stock: params.stock, sort: params.sort }, 1)}
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
          <>
            {totalPages > 1 && <ProductPagination page={page} totalPages={totalPages} filters={filters} />}
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 2xl:grid-cols-5">
              {products.map((product, index) => (
                <li key={product.id} className="group">
                  <ProductCard product={product} eager={index === 0} />
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <>
                <ProductPagination page={page} totalPages={totalPages} filters={filters} scrollToBottom />
                <span id="pg-btm" aria-hidden="true" className="block h-px" style={{ scrollMarginTop: 'calc(100dvh - 1rem)' }} />
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
