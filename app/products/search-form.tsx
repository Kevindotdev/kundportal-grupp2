'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { Category } from '@/app/types';

// Temporary storefront search control for issue #21. Issue #8 can move this
// interaction into the header; keep the same `search` URL parameter and clear behavior.
export default function CatalogSearchForm({
  search,
  categories,
  selectedCategories,
}: {
  search: string;
  categories: Category[];
  selectedCategories: string[];
}) {
  const router = useRouter();
  const currentParams = useSearchParams();
  const [value, setValue] = useState(search);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(currentParams.toString());
    const term = value.trim();

    if (term) params.set('search', term);
    else params.delete('search');

    params.delete('category');
    const formData = new FormData(event.currentTarget);
    for (const category of formData.getAll('category')) {
      params.append('category', String(category));
    }

    params.delete('page');
    router.push(`/products${params.size ? `?${params.toString()}` : ''}`);
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
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
