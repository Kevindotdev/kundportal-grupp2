import Link from 'next/link';
import { connection } from 'next/server';
import { UserRound } from 'lucide-react';
import CartLink from '@/components/cart-link';
import ProductSearch, { type ProductSearchItem } from '@/components/product-search';
import ProductService from '@/services/product-service';

export default async function StorefrontHeader() {
  await connection();
  const response = await ProductService.getAllProducts();
  const searchableProducts: ProductSearchItem[] = response.success ? response.data.products.map(
    ({ id, title, tags, sku, brand, category, thumbnail, price, discountPercentage }) => ({
      id,
      title,
      tags,
      sku,
      brand,
      category,
      thumbnail,
      price,
      discountPercentage,
    }),
  ) : [];

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
            <CartLink />
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
