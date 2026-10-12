'use client';

import { useRouter } from 'next/navigation';

export default function ProductLoadError({ message }: { message: string }) {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-semibold">Product details are unavailable</h1>
      <p role="alert" className="mt-3 text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-6 min-h-11 bg-primary px-5 font-semibold text-primary-foreground"
      >
        Try again
      </button>
    </main>
  );
}