import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './_styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  display: 'swap',
  subsets: ['latin'],
});

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} admin-shell antialiased`}>
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}
