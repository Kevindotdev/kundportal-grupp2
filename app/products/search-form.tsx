'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { Category } from '@/app/types';
import { validatePriceRange } from '@/utils/product-query';

// Temporary storefront search control for issue #21. Issue #8 can move this
// interaction into the header; keep the same `search` URL parameter and clear behavior.
export default function CatalogSearchForm({
  search,
  categories,
  selectedCategories,
  minPrice,
  maxPrice,
  inStock,
  initialPriceError,
}: {
  search: string;
  categories: Category[];
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  initialPriceError: string;
}) {
  const router = useRouter();
  const currentParams = useSearchParams();
  const [value, setValue] = useState(search);
  const [minimum, setMinimum] = useState(minPrice);
  const [maximum, setMaximum] = useState(maxPrice);
  const [priceError, setPriceError] = useState(initialPriceError);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validatePriceRange(minimum, maximum);
    setPriceError(validation.error ?? '');
    if (validation.error) return;

    const params = new URLSearchParams(currentParams.toString());
    const term = value.trim();

    if (term) params.set('search', term);
    else params.delete('search');

    params.delete('category');
    const formData = new FormData(event.currentTarget);
    for (const category of formData.getAll('category')) {
      params.append('category', String(category));
    }

    if (minimum) params.set('minPrice', minimum);
    else params.delete('minPrice');

    if (maximum) params.set('maxPrice', maximum);
    else params.delete('maxPrice');

    params.delete('stock');
    if (formData.has('inStock')) params.set('inStock', 'true');
    else params.delete('inStock');

    params.set('page', '1');
    router.push(`/products${params.size ? `?${params.toString()}` : ''}`);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="catalog-search">Search products</label>
        <input
          id="catalog-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="rounded border border-border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="catalog-min-price">Minimum price</label>
        <input
          id="catalog-min-price"
          name="minPrice"
          type="text"
          inputMode="decimal"
          value={minimum}
          onChange={(event) => {
            const nextValue = event.target.value;
            setMinimum(nextValue);
            setPriceError(validatePriceRange(nextValue, maximum).error ?? '');
          }}
          aria-invalid={Boolean(priceError)}
          aria-describedby={priceError ? 'price-filter-error' : undefined}
          className="w-32 rounded border border-border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="catalog-max-price">Maximum price</label>
        <input
          id="catalog-max-price"
          name="maxPrice"
          type="text"
          inputMode="decimal"
          value={maximum}
          onChange={(event) => {
            const nextValue = event.target.value;
            setMaximum(nextValue);
            setPriceError(validatePriceRange(minimum, nextValue).error ?? '');
          }}
          aria-invalid={Boolean(priceError)}
          aria-describedby={priceError ? 'price-filter-error' : undefined}
          className="w-32 rounded border border-border px-3 py-2"
        />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="inStock" value="true" defaultChecked={inStock} className="size-4 accent-primary" />
        In stock only
      </label>
      {priceError && (
        <p id="price-filter-error" role="alert" className="min-w-full text-sm text-red-700">
          {priceError}
        </p>
      )}
      {categories.length > 0 && (
        <fieldset className="flex min-w-full flex-wrap gap-x-4 gap-y-2">
          <legend className="mb-1 text-sm font-medium">Categories</legend>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="category"
                value={category.id}
                defaultChecked={selectedCategories.includes(String(category.id))}
                className="size-4 accent-primary"
              />
              {category.name}
            </label>
          ))}
        </fieldset>
      )}
      <button type="submit" className="rounded bg-foreground px-4 py-2 text-background">
        Search
      </button>
    </form>
  );
}
