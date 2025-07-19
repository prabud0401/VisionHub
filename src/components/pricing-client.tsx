
'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';

const plans = {
  monthly: [
    { id: 'price_starter_monthly', name: 'Basic', price: '$10', lkrPrice: 'LKR 3,000', credits: 500, features: ['500 credits/mo', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_monthly', name: 'Standard', price: '$25', lkrPrice: 'LKR 7,500', credits: 1500, features: ['1500 credits/mo', 'Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
    { id: 'price_premium_monthly', name: 'Premium', price: '$60', lkrPrice: 'LKR 18,000', credits: 4000, features: ['4000 credits/mo', 'Everything in Standard', 'Up to 4K+ quality', 'API Access', 'Dedicated Support'], highlighted: false },
  ],
  annually: [
    { id: 'price_starter_annual', name: 'Basic', price: '$96', lkrPrice: 'LKR 28,800', credits: 500, features: ['500 credits/mo', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_annual', name: 'Standard', price: '$240', lkrPrice: 'LKR 72,000', credits: 1500, features: ['1500 credits/mo', 'Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
    { id: 'price_premium_annual', name: 'Premium', price: '$576', lkrPrice: 'LKR 172,800', credits: 4000, features: ['4000 credits/mo', 'Everything in Standard', 'Up to 4K+ quality', 'API Access', 'Dedicated Support'], highlighted: false },
  ],
};

function PricingComponent() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user, setAuthModalOpen } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, setSelectedPlan] = useLocalStorage('selectedPlan', null);

  const isLKR = searchParams.get('currency') === 'LKR';

  const handleCurrencyToggle = (checked: boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (checked) {
        current.set("currency", "LKR");
    } else {
        current.delete("currency");
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };
  
  const currentPlans = isAnnual ? plans.annually : plans.monthly;
  const billingCycle = isAnnual ? 'annually' : 'monthly';

  const handleChoosePlan = (plan: typeof currentPlans[0]) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const finalPrice = isLKR ? plan.lkrPrice : plan.price;
    const planDetails = {
      ...plan,
      price: finalPrice, 
      billing: billingCycle
    };
    setSelectedPlan(planDetails);
    router.push('/buy-credits');
  };

  return (
    <div className="w-full">
        <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
                <Label htmlFor="billing-toggle">Monthly</Label>
                <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
                <Label htmlFor="billing-toggle">Annually (Save 20%)</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Label htmlFor="currency-toggle">USD</Label>
                <Switch id="currency-toggle" checked={isLKR} onCheckedChange={handleCurrencyToggle} />
                <Label htmlFor="currency-toggle">LKR</Label>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {currentPlans.map((plan) => (
            <Card key={plan.id} className={cn(
              "flex flex-col text-center transform hover:-translate-y-2 transition-transform duration-300",
              plan.highlighted ? "border-primary shadow-primary/20 shadow-lg" : "border-border"
            )}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                    <span className="text-4xl font-bold text-foreground">
                        {isLKR ? plan.lkrPrice : plan.price}
                    </span>
                    /{isAnnual ? 'year' : 'month'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="flex items-center justify-center gap-2 text-lg font-semibold text-primary mb-4">
                    <Gem className="h-5 w-5" />
                    {plan.credits.toLocaleString()} {isAnnual ? 'credits/mo' : 'credits'}
                </p>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                    onClick={() => handleChoosePlan(plan)}
                    variant={plan.highlighted ? 'default' : 'outline'} 
                    className="w-full mt-auto"
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
}

export function PricingClient() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <PricingComponent />
    </Suspense>
  )
}
