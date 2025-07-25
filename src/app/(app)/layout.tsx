
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ImprovedHeader from '@/components/layout/header-improved';
import Footer from '@/components/layout/footer';
import { ErrorBoundary } from '@/components/error-boundary';
import { Bot } from 'lucide-react';
import Image from 'next/image';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
        <Image src="/images/load.png" alt="VisionHub Logo" width={200} height={50} />
        <p className="text-muted-foreground animate-pulse">Unleashing Creativity...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <ErrorBoundary>
        <ImprovedHeader />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
