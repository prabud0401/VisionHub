
import Footer from "@/components/layout/footer";
import HeaderUnauthenticated from "@/components/layout/header-unauthenticated";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeaderUnauthenticated />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
