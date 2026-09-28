import StorefrontHeader from '@/components/storefront-header';
import StorefrontFooter from '@/components/storefront-footer';

export default function HomePage() {
  return (
    <>
      <StorefrontHeader />
      <main>{/* Homepage content/components go here. */}</main>
      <StorefrontFooter />
    </>
  );
}
