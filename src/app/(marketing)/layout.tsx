
import Footer from "@/components/layout/footer";
import ImprovedHeader from "@/components/layout/header-improved";
import { ErrorBoundary } from "@/components/error-boundary";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ErrorBoundary>
        <ImprovedHeader />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
