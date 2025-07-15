
'use client';

import { useAuth } from '@/context/auth-context';
import LandingPage from '@/app/(marketing)/home/page';

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }
  
  return <LandingPage />;
}
