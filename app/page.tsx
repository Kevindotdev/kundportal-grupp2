import StorefrontHeader from '@/components/storefront-header';
import StorefrontFooter from '@/components/storefront-footer';

export default function HomePage() {
  return (
    <div className="storefront min-h-screen bg-background text-foreground">
      <StorefrontHeader />
      <main>{/* Homepage content/components go here. */}</main>
      <StorefrontFooter />
    </div>
  );
}
