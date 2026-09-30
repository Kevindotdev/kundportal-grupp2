import Link from 'next/link';
import { ShoppingCart, UserRound } from 'lucide-react';

export default function StorefrontHeader() {
  return (
    <header className="border-b border-border bg-surface text-surface-foreground">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
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
    </header>
  );
}
