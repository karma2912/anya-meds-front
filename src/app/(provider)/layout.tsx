
import { ProviderNavbar } from '@/components/provider/ProviderNavbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <ProviderNavbar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
  );
}