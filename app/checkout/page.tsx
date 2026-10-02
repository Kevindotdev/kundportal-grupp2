import CheckoutForm from '@/components/checkout-form';

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="border-b border-border pb-6 text-2xl font-bold">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
