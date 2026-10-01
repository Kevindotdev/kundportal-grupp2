'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useCart } from '@/components/cart-provider';
import type { CartItem } from '@/lib/cart';

type DeliveryDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
};

const initialDeliveryDetails: DeliveryDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  postalCode: '',
  city: '',
  country: '',
};

function orderTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function OrderSummary({ items }: { items: CartItem[] }) {
  return (
    <section aria-labelledby="order-summary-heading" className="border border-border p-5">
      <h2 id="order-summary-heading" className="mb-4 text-xl font-semibold">Your order</h2>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <Image
              src={item.thumbnail}
              alt=""
              width={64}
              height={64}
              className="size-16 object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
            </div>
            <p className="shrink-0 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-semibold">
        <span>Order total</span>
        <span>${orderTotal(items).toFixed(2)}</span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">Shipping and tax are not included.</p>
    </section>
  );
}

export default function CheckoutForm() {
  const { items, isReady, storageError, setQuantity, removeItem, clearCart } = useCart();
  const [details, setDetails] = useState(initialDeliveryDetails);
  const [validationMessage, setValidationMessage] = useState('');
  const [order, setOrder] = useState<CartItem[] | null>(null);

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationMessage('');

    if (items.length === 0) {
      setValidationMessage('Your cart is empty. Add an item before placing your order.');
      return;
    }

    const requiredFields: [keyof DeliveryDetails, string][] = [
      ['firstName', 'first name'],
      ['lastName', 'last name'],
      ['email', 'email'],
      ['street', 'street address'],
      ['postalCode', 'postal code'],
      ['city', 'city'],
      ['country', 'country'],
    ];
    const missingFields = requiredFields
      .filter(([field]) => details[field].trim() === '')
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setValidationMessage(`Please enter your ${missingFields.join(', ')}.`);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
      setValidationMessage('Please enter a valid email address.');
      return;
    }

    const confirmedItems = items.map((item) => ({ ...item }));
    if (!clearCart()) {
      setValidationMessage('Your order could not be completed because the saved cart could not be cleared.');
      return;
    }
    setOrder(confirmedItems);
  }

  if (!isReady) return <p role="status" className="mt-6">Loading your cart…</p>;

  if (storageError) {
    return <p role="alert" className="mt-6 text-destructive">{storageError}</p>;
  }

  if (order) {
    return (
      <div className="mt-6 space-y-6">
        <div role="status" className="border border-success p-5">
          <h2 className="text-xl font-semibold">Order confirmed</h2>
          <p className="mt-2">This demo order is confirmed. No payment was collected or order saved to a server.</p>
        </div>
        <OrderSummary items={order} />
        <Link href="/products" className="inline-flex min-h-11 items-center underline underline-offset-4">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 space-y-4">
        <p>Your cart is empty.</p>
        <Link href="/products" className="inline-flex min-h-11 items-center underline underline-offset-4">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <section aria-labelledby="cart-items-heading" className="border border-border p-5">
          <h2 id="cart-items-heading" className="mb-4 text-xl font-semibold">Review your items</h2>
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <Image
                  src={item.thumbnail}
                  alt=""
                  width={64}
                  height={64}
                  className="size-16 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm">${item.price.toFixed(2)} each</p>
                  <div className="mt-2 flex items-center gap-2">
                    <label htmlFor={`quantity-${item.id}`} className="text-sm">Quantity</label>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(event) => {
                        const quantity = Number(event.target.value);
                        if (Number.isSafeInteger(quantity) && quantity > 0) setQuantity(item.id, quantity);
                      }}
                      className="w-20 border border-border px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="min-h-11 px-2 text-sm underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="shrink-0 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-semibold">
            <span>Order total</span>
            <span>${orderTotal(items).toFixed(2)}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Shipping and tax are not included.</p>
        </section>

        <section aria-labelledby="delivery-heading" className="border border-border p-5">
          <h2 id="delivery-heading" className="mb-4 text-xl font-semibold">Delivery information</h2>
          <form onSubmit={submitOrder} noValidate className="space-y-4">
            {validationMessage && (
              <p role="alert" className="border border-destructive p-3 text-destructive">
                {validationMessage}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                First name <span className="sr-only">(required)</span>
                <input
                  name="firstName"
                  required
                  autoComplete="given-name"
                  value={details.firstName}
                  onChange={(event) => setDetails({ ...details, firstName: event.target.value })}
                  className="min-h-11 border border-border px-3"
                />
              </label>
              <label className="flex flex-col gap-1">
                Last name <span className="sr-only">(required)</span>
                <input
                  name="lastName"
                  required
                  autoComplete="family-name"
                  value={details.lastName}
                  onChange={(event) => setDetails({ ...details, lastName: event.target.value })}
                  className="min-h-11 border border-border px-3"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              Email <span className="sr-only">(required)</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={details.email}
                onChange={(event) => setDetails({ ...details, email: event.target.value })}
                className="min-h-11 border border-border px-3"
              />
            </label>
            <label className="flex flex-col gap-1">
              Phone (optional)
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                value={details.phone}
                onChange={(event) => setDetails({ ...details, phone: event.target.value })}
                className="min-h-11 border border-border px-3"
              />
            </label>
            <label className="flex flex-col gap-1">
              Street address <span className="sr-only">(required)</span>
              <input
                name="street"
                required
                autoComplete="street-address"
                value={details.street}
                onChange={(event) => setDetails({ ...details, street: event.target.value })}
                className="min-h-11 border border-border px-3"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                Postal code <span className="sr-only">(required)</span>
                <input
                  name="postalCode"
                  required
                  autoComplete="postal-code"
                  value={details.postalCode}
                  onChange={(event) => setDetails({ ...details, postalCode: event.target.value })}
                  className="min-h-11 border border-border px-3"
                />
              </label>
              <label className="flex flex-col gap-1">
                City <span className="sr-only">(required)</span>
                <input
                  name="city"
                  required
                  autoComplete="address-level2"
                  value={details.city}
                  onChange={(event) => setDetails({ ...details, city: event.target.value })}
                  className="min-h-11 border border-border px-3"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              Country <span className="sr-only">(required)</span>
              <input
                name="country"
                required
                autoComplete="country-name"
                value={details.country}
                onChange={(event) => setDetails({ ...details, country: event.target.value })}
                className="min-h-11 border border-border px-3"
              />
            </label>
            <button type="submit" className="min-h-11 bg-primary px-5 font-semibold text-primary-foreground">
              Place demo order
            </button>
          </form>
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <OrderSummary items={items} />
      </aside>
    </div>
  );
}
