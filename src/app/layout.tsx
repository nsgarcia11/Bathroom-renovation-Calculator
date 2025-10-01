import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { ContractorProvider } from '@/contexts/ContractorContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bathroom Renovation Calculator',
  description: 'Professional bathroom renovation estimation tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className} suppressHydrationWarning={true}>
        <QueryProvider>
          <ContractorProvider>{children}</ContractorProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
