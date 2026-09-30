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
        <nav aria-label="Main navigation" className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Webshop
          </Link>

          <div className="flex items-center gap-2">
          {/* Issue #21 entry point for the temporary catalog. Issue #8 can
              replace this link with the storefront header search control. */}
          <Link href="/products" className="px-3 py-2 hover:underline">
            Products
          </Link>
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
        <ProductSearch products={searchableProducts} />
      </div>
    </header>
  );
}
