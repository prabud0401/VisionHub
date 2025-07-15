
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';

export function CookieConsentBanner() {
  const [consent, setConsent] = useLocalStorage<boolean | null>('cookie-consent', null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show the banner if consent hasn't been given yet
    if (consent === null) {
      // Use a timeout to avoid layout shift on initial load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [consent]);

  const handleAccept = () => {
    setConsent(true);
    setIsVisible(false);
  };

  if (!isVisible || consent !== null) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[200] p-4 transition-all duration-500',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
    >
      <div className="container mx-auto max-w-5xl">
         <Card className="bg-card/90 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left flex-grow">
              We use cookies to enhance your experience and analyze site traffic. By clicking "Accept", you agree to our use of cookies. Read our{' '}
              <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
            <Button onClick={handleAccept} size="sm">Accept</Button>
          </CardContent>
         </Card>
      </div>
    </div>
  );
}
