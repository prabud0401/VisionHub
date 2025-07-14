
'use client';

import LandingPage from './(marketing)/home/page';
import { useAuth } from '@/context/auth-context';
import DashboardPage from './(app)/dashboard/page';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  // This logic was causing issues. Reverting it.
  // The user should be able to see marketing pages even if logged in.
  // if (user) {
  //   return <DashboardPage />;
  // }
  
  return <LandingPage />;
}
