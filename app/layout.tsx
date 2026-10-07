import type { Metadata } from 'next';
import CartProvider from '@/components/cart-provider';
import ButtonClickFeedback from '@/components/button-click-feedback';
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
        <ButtonClickFeedback />
      </body>
    </html>
  );
}
