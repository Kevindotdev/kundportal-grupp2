import StorefrontHeader from '@/components/storefront-header';
import StorefrontFooter from '@/components/storefront-footer';
import StorefrontMain from '@/components/storefront-main';

export default function HomePage() {
  return (
    <div className="storefront min-h-screen bg-background text-foreground">
      <StorefrontHeader />
      <StorefrontMain />
      <StorefrontFooter />
    </div>
  );
}
