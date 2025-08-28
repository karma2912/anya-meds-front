import { ProviderNavbar } from "@/components/provider/ProviderNavbar";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNavbar />
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}