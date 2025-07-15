
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Check, CreditCard, Gem } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Separator } from '@/components/ui/separator';

interface PlanDetails {
  id: string;
  name: string;
  price: string;
  credits: number;
  features: string[];
  billing: 'monthly' | 'annually';
}

export default function BuyCreditsPage() {
  const [selectedPlan] = useLocalStorage<PlanDetails | null>('selectedPlan', null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If no plan is selected, or user is not logged in, redirect.
    if (!selectedPlan || !user) {
      router.push('/pricing');
    } else {
      setIsLoading(false);
    }
  }, [selectedPlan, user, router]);

  const handlePayment = () => {
    // This is a placeholder for a real payment integration
    alert('Payment functionality is a placeholder. In a real app, this would redirect to a payment processor like Stripe or PayPal.');
  };

  if (isLoading || !selectedPlan) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-20 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Complete Your Purchase
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You're about to add more credits to your account.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{selectedPlan.name} Plan</CardTitle>
              <CardDescription className="capitalize">{selectedPlan.billing} Billing</CardDescription>
            </div>
            <div className="text-right">
                <p className="text-4xl font-bold">{selectedPlan.price}</p>
                <p className="flex items-center justify-end gap-2 text-primary font-semibold">
                    <Gem className="h-5 w-5" />
                    {selectedPlan.credits} credits
                </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-6" />
          <h3 className="font-semibold mb-4">Plan Features:</h3>
          <ul className="space-y-3 mb-8">
            {selectedPlan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePayment} size="lg" className="w-full">
            <CreditCard className="mr-2 h-5 w-5" />
            Pay {selectedPlan.price} Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
