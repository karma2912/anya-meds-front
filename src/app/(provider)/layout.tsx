"use client"
import { ProviderNavbar } from '@/components/provider/ProviderNavbar';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <SessionProvider>
          <ProviderNavbar />
          <main className="flex-grow">
            {children}
          </main>
          </SessionProvider>
        </div>
  );
}