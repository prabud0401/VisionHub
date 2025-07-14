
'use client';

import LandingPage from './(marketing)/home/page';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This logic is handled by the main layout now.
    // This page should primarily handle the landing content.
  }, [user, loading, router]);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  // To prevent routing loops and ensure clarity, the root page now always shows the landing page.
  // The header component will show the appropriate actions (Dashboard/Get Started) based on auth state.
  return <LandingPage />;
}
