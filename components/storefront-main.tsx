import Link from 'next/link';
import ProductCard from '@/components/product-card';
import CategoryService from '@/services/category-service';
import ProductService from '@/services/product-service';

export default async function StorefrontMain() {
  const [productResponse, categoryResponse] = await Promise.all([
    ProductService.getProducts(1, '', '', ''),
    CategoryService.getAllCategories(),
  ]);

  const products = productResponse.success ? productResponse.data.products.slice(0, 4) : [];
  const categories = categoryResponse.success ? categoryResponse.data.categories : [];

  return (
    <main className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section
        aria-labelledby="home-heading"
        className="border border-border bg-surface px-6 py-12 sm:px-10 sm:py-16"
      >
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
            Welcome to Webshop
          </p>
          <h1 id="home-heading" className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find something you’ll love.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-7 text-muted-foreground">
            Explore our collection and discover something new for your everyday life.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex min-h-11 items-center justify-center bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Shop all products
          </Link>
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="categories-heading" className="text-2xl font-bold">
              Shop by category
            </h2>
            <p className="mt-1 text-muted-foreground">Browse the collection by what you need.</p>
          </div>
          <Link href="/products" className="font-medium text-primary underline underline-offset-4">
            View all products
          </Link>
        </div>

        {categoryResponse.success ? (
          categories.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="flex min-h-14 items-center justify-between gap-3 border border-border bg-surface px-4 py-3 font-medium transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span>{category.name}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No product categories are available yet.</p>
          )
        ) : (
          <p role="alert" className="text-error">
            Categories could not be loaded. Please browse all products instead.
          </p>
        )}
      </section>

      <section aria-labelledby="featured-heading">
        <div className="mb-5">
          <h2 id="featured-heading" className="text-2xl font-bold">
            Featured picks
          </h2>
          <p className="mt-1 text-muted-foreground">A few products to help you get started.</p>
        </div>

        {productResponse.success ? (
          products.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {products.map((product, index) => (
                <li key={product.id} className="group">
                  <ProductCard product={product} eager={index === 0} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No products are available yet.</p>
          )
        ) : (
          <p role="alert" className="text-error">
            Featured products could not be loaded. Please browse all products instead.
          </p>
        )}
      </section>
    </main>
  );
}
