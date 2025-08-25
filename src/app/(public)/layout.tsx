import MarketingNavbar from "@/components/MarketingNavbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  );
}