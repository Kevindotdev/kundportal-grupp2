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
    <header className="border-b border-border bg-surface text-surface-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Main navigation"
          className="flex min-h-16 flex-wrap items-center justify-start gap-x-4 gap-y-3 py-3 md:flex-nowrap md:py-0"
        >
          <Link href="/" className="order-1 shrink-0 text-xl font-bold">
            Webshop
          </Link>
          <ProductSearch products={searchableProducts} />

          <div className="order-2 flex items-center gap-2 md:order-3">
            <span
              role="img"
              aria-label="Shopping cart"
              className="inline-flex size-11 items-center justify-center"
            >
              <ShoppingCart aria-hidden="true" size={20} />
            </span>
            <Link
              href="/admin"
              aria-label="Log in"
              className="inline-flex size-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <UserRound aria-hidden="true" size={20} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
