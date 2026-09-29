import Link from 'next/link';
import { ShoppingCart, UserRound } from 'lucide-react';
import type { Product } from '@/app/types';
import ProductSearch, { type ProductSearchItem } from '@/components/product-search';
import productsData from '@/server/products.json';

const sourceProducts: Product[] = productsData.products;
const searchableProducts: ProductSearchItem[] = sourceProducts.map(({ id, title, tags, sku, brand, thumbnail, price }) => ({
  id,
  title,
  tags,
  sku,
  brand,
  thumbnail,
  price,
}));

export default function StorefrontHeader() {
  return (
    <header className="border-b border-slate-200 bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Main navigation" className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Webshop
          </Link>

          <div className="flex items-center gap-2">
            <span role="img" aria-label="Shopping cart" className="inline-flex size-11 items-center justify-center">
              <ShoppingCart aria-hidden="true" size={20} />
            </span>
            <Link
              href="/admin"
              aria-label="Log in"
              className="inline-flex size-11 items-center justify-center rounded-md hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <UserRound aria-hidden="true" size={20} />
            </Link>
          </div>
        </nav>
        <ProductSearch products={searchableProducts} />
      </div>
    </header>
  );
}
