'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Product } from '@/app/types';
import { matchesProductQuery } from '@/utils/product-search';

export interface ProductSearchItem {
  id: number;
  title: string;
  tags?: string[];
  sku?: string;
  brand?: string;
  category?: Product['category'];
  thumbnail: string;
  price: number;
}

interface ProductSearchProps {
  products: ProductSearchItem[];
}

export default function ProductSearch({ products }: ProductSearchProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const normalizedQuery = query.trim();
  const eligible = normalizedQuery.length >= 2;
  const results = eligible ? products.filter((product) => matchesProductQuery(product, normalizedQuery)) : [];
  const suggestions = results.slice(0, 5);

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eligible) return;
    router.push(`/products?search=${encodeURIComponent(normalizedQuery)}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (eligible && suggestions.length > 0 && event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (eligible && suggestions.length > 0 && event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      router.push(`/products/${suggestions[activeIndex].id}`);
    } else if (event.key === 'Enter' && !eligible) {
      event.preventDefault();
    }
  }

  return (
    <section
      ref={rootRef}
      aria-label="Product search"
      className="relative order-3 w-full min-w-0 md:order-2 md:ml-auto md:w-80 md:flex-none"
    >
      <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onFocus={() => eligible && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && eligible}
          aria-controls="product-search-results"
          aria-activedescendant={activeIndex >= 0 ? `product-search-option-${suggestions[activeIndex]?.id}` : undefined}
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-300"
        />
        <button
          type="submit"
          disabled={!eligible}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search aria-hidden="true" size={16} />
          Search
        </button>
      </form>

      {isOpen && eligible && (
        <div id="product-search-results" className="absolute left-0 top-full z-50 mt-2 w-full rounded-md border border-border bg-surface text-surface-foreground shadow-lg">
          {results.length === 0 ? (
            <p role="status" className="p-3 text-sm text-muted-foreground">No products found for “{normalizedQuery}”.</p>
          ) : (
            <>
              <p role="status" className="px-3 pt-3 text-sm text-muted-foreground">
                {results.length > 5
                  ? `5 of ${results.length} results for “${normalizedQuery}”`
                  : `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${normalizedQuery}”`}
              </p>
              <ul role="listbox" aria-label="Product suggestions" className="p-2">
                {suggestions.map((product, index) => (
                  <li key={product.id}>
                    <Link
                      id={`product-search-option-${product.id}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      href={`/products/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded px-2 py-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary ${index === activeIndex ? 'bg-muted' : ''}`}
                    >
                      <Image src={product.thumbnail} alt="" width={48} height={48} unoptimized className="size-12 shrink-0 rounded object-cover" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{product.title}</span>
                      <span className="shrink-0 text-sm text-muted-foreground">€{product.price.toFixed(2)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
