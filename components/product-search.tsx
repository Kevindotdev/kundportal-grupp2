'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';

export interface ProductSearchItem {
  id: number;
  title: string;
  tags?: string[];
  sku?: string;
  brand?: string;
  thumbnail: string;
  price: number;
}

interface ProductSearchProps {
  products: ProductSearchItem[];
}

function matchesQuery(product: ProductSearchItem, query: string): boolean {
  const searchableFields = [product.title, ...(product.tags ?? []), product.sku, product.brand];

  return searchableFields.some((field) => field?.toLowerCase().startsWith(query));
}

export default function ProductSearch({ products }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const normalizedQuery = submittedQuery?.toLowerCase();
  const results = normalizedQuery ? products.filter((product) => matchesQuery(product, normalizedQuery)) : [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      setSubmittedQuery(trimmedQuery);
    }
  }

  return (
    <section
      aria-label="Product search"
      className="order-3 w-full min-w-0 md:order-2 md:ml-auto md:w-72 md:flex-none"
    >
      <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products"
          aria-controls="product-search-results"
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-300"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search aria-hidden="true" size={16} />
          Search
        </button>
      </form>

      {!query.trim() ? (
        <p className="mt-3 text-sm text-slate-600">Enter a search term to find products.</p>
      ) : submittedQuery === null ? (
        <p className="mt-3 text-sm text-slate-600">Press Search or Enter to find products.</p>
      ) : null}

      <div id="product-search-results" className="mt-3">
        {submittedQuery !== null &&
          (results.length === 0 ? (
            <p role="status" className="text-sm text-slate-600">
              No products found.
            </p>
          ) : (
            <>
              <p role="status" className="text-sm text-slate-600">
                {results.length} {results.length === 1 ? 'product' : 'products'} found for “{submittedQuery}”.
              </p>
              <ul className="mt-2 max-h-80 divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200">
                {results.map((product) => (
                  <li key={product.id} className="flex items-center gap-3 px-3 py-2">
                    <Image src={product.thumbnail} alt="" width={48} height={48} unoptimized className="size-12 shrink-0 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{product.title}</p>
                      <p className="text-sm text-slate-600">€{product.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ))}
      </div>
    </section>
  );
}
