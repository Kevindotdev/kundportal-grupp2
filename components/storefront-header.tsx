import Link from 'next/link';
import { ShoppingCart, UserRound } from 'lucide-react';

export default function StorefrontHeader() {
  return (
    <header className="border-b border-slate-200 bg-white text-slate-900">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="text-xl font-bold">
          Webshop
        </Link>

        <div className="flex items-center gap-2">
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
            className="inline-flex size-11 items-center justify-center rounded-md hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <UserRound aria-hidden="true" size={20} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
