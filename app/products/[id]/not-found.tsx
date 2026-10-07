import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="mt-3 text-muted-foreground">This product may have been removed or the link may be incorrect.</p>
      <Link href="/products" className="mt-6 inline-block underline underline-offset-4 hover:text-primary">
        Browse products
      </Link>
    </main>
  );
}