import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import AddToCartButton from '@/components/add-to-cart-button';
import ProductLoadError from '@/components/product-load-error';
import ProductGallery from '@/components/product-gallery';
import ProductService from '@/services/product-service';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

function parseProductId(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const productId = Number(value);
  return Number.isSafeInteger(productId) && productId > 0 ? productId : null;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseProductId(id);
  if (productId === null) return { title: 'Product not found | Webshop' };

  const response = await ProductService.getProductById(productId);
  if (!response.success) {
    return { title: response.status === 404 ? 'Product not found | Webshop' : 'Product | Webshop' };
  }

  return {
    title: `${response.data.title} | Webshop`,
    description: response.data.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseProductId(id);
  if (productId === null) notFound();

  const response = await ProductService.getProductById(productId);
  if (!response.success) {
    if (response.status === 404) notFound();
    return <ProductLoadError message={response.message} />;
  }

  const { product } = { product: response.data };
  const outOfStock = product.stock !== undefined && product.stock <= 0;
  const statusIsOutOfStock = product.availabilityStatus?.toLowerCase() === 'out of stock';
  const purchaseDisabled = outOfStock || statusIsOutOfStock;
  const stockLabel = product.stock === undefined
    ? product.availabilityStatus ?? 'Availability unknown'
    : product.stock <= 0
      ? 'Out of stock'
      : `${product.stock} in stock${product.availabilityStatus ? ` - ${product.availabilityStatus}` : ''}`;
  const details = [
    { label: 'Brand', value: product.brand },
    { label: 'SKU', value: product.sku },
    { label: 'Weight', value: product.weight },
    {
      label: 'Dimensions (W x H x D)',
      value: product.dimensions
        ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth}`
        : undefined,
    },
    { label: 'Warranty', value: product.warrantyInformation },
    { label: 'Shipping', value: product.shippingInformation },
    { label: 'Return policy', value: product.returnPolicy },
  ].filter(({ value }) => value !== undefined && value !== '');

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/products" className="text-sm underline underline-offset-4 hover:text-primary">
        Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery title={product.title} images={product.images} thumbnail={product.thumbnail} />

        <article>
          {product.category && <p className="text-sm text-muted-foreground">{product.category.name}</p>}
          <h1 className="mt-2 text-3xl font-bold">{product.title}</h1>
          {product.rating !== undefined && (
            <p className="mt-3 flex items-center gap-2" aria-label={`Rated ${product.rating.toFixed(1)} out of 5`}>
              <Star aria-hidden="true" size={18} className="fill-rating text-rating" />
              <span>{product.rating.toFixed(1)} / 5</span>
            </p>
          )}

          {product.discountPercentage !== undefined ? (
            <div className="mt-5 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-muted-foreground line-through">${product.price.toFixed(2)}</p>
              <p className="text-3xl font-bold text-primary">${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</p>
            </div>
          ) : (
            <p className="mt-5 text-2xl font-semibold">${product.price.toFixed(2)}</p>
          )}
          {product.discountPercentage !== undefined && (
            <p className="mt-1 text-sm text-muted-foreground">Discount: {product.discountPercentage}%</p>
          )}
          <p className="mt-4 text-sm" aria-live="polite">Availability: {stockLabel}</p>
          <p className="mt-5 leading-7">{product.description}</p>

          <AddToCartButton
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
            }}
            disabled={purchaseDisabled}
            className="mt-6"
          />

          {details.length > 0 && (
            <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-2">
              {details.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product.tags && product.tags.length > 0 && (
            <p className="mt-6 text-sm">
              <span className="font-medium">Tags:</span> {product.tags.join(', ')}
            </p>
          )}
        </article>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <section aria-labelledby="product-reviews" className="mt-12 border-t border-border pt-8">
          <h2 id="product-reviews" className="text-xl font-semibold">Customer reviews</h2>
          <ul className="mt-5 divide-y divide-border">
            {product.reviews.map((review, index) => (
              <li key={`${review.date}-${review.reviewerName}-${index}`} className="py-5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h3 className="font-medium">{review.reviewerName}</h3>
                  <span className="text-sm" aria-label={`Rated ${review.rating} out of 5`}>
                    {review.rating} / 5
                  </span>
                  <time className="text-sm text-muted-foreground" dateTime={review.date}>
                    {formatDate(review.date)}
                  </time>
                </div>
                <p className="mt-2">{review.comment}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}