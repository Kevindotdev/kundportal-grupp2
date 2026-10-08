import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import AddToCartButton from '@/components/add-to-cart-button';
import type { Product } from '@/app/types';
import { discountedPrice } from '@/utils/product-price';

export default function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  return (
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
            loading={eager ? 'eager' : 'lazy'}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-7"
          />
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground">
            {product.category?.name ?? 'Uncategorized'}
          </span>
          {(product.discountPercentage ?? 0) > 0 && (
            <span className="absolute bottom-3 right-3 whitespace-nowrap rounded-full bg-error px-2.5 py-1 text-[11px] font-semibold text-background sm:text-xs">
              {product.discountPercentage}%
            </span>
          )}
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
          <p className="shrink-0 font-semibold">${discountedPrice(product).toFixed(2)}</p>
        </div>
      </Link>
      <AddToCartButton
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
        }}
      />
    </article>
  );
}
