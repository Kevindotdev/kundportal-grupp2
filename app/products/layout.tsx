import StorefrontFooter from '@/components/storefront-footer';
import StorefrontHeader from '@/components/storefront-header';

export default function ProductsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="storefront flex min-h-screen flex-col bg-background text-foreground">
      <StorefrontHeader />
      <div className="flex-1">{children}</div>
      <StorefrontFooter />
    </div>
  );
}
