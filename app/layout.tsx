import type { Metadata } from 'next';
import CartProvider from '@/components/cart-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Webshop',
  description: 'Webshop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
