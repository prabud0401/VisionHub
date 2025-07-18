
'use client';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

const plans = {
  monthly: [
    { id: 'price_basic_monthly', name: 'Basic', price: '$10', credits: 500, features: ['Supported by ads', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_monthly', name: 'Standard', price: '$25', credits: 1500, features: ['Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
    { id: 'price_premium_monthly', name: 'Premium', price: '$50', credits: 4000, features: ['Ad-Free Experience', '4K+ resolution', 'API access', 'Dedicated support'] },
  ],
  annually: [
    { id: 'price_basic_annual', name: 'Basic', price: '$96', credits: 500, features: ['500 credits/mo', 'Supported by ads', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_annual', name: 'Standard', price: '$240', credits: 1500, features: ['1500 credits/mo', 'Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
    { id: 'price_premium_annual', name: 'Premium', price: '$480', credits: 4000, features: ['4000 credits/mo', 'Ad-Free Experience', '4K+ resolution', 'API access', 'Dedicated support'] },
  ],
};

export function PricingClient() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user, setAuthModalOpen } = useAuth();
  const router = useRouter();
  const [, setSelectedPlan] = useLocalStorage('selectedPlan', null);
  
  const currentPlans = isAnnual ? plans.annually : plans.monthly;

  const handleChoosePlan = (plan: typeof currentPlans[0]) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const planDetails = {
      ...plan,
      billing: isAnnual ? 'annually' : 'monthly'
    };
    setSelectedPlan(planDetails);
    router.push('/buy-credits');
  };

  return (
    <div className="w-full">
        <div className="flex items-center justify-center space-x-2 mb-12">
          <Label htmlFor="billing-toggle">Monthly</Label>
          <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
          <Label htmlFor="billing-toggle">Annually (Save 20%)</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {currentPlans.map((plan) => (
            <Card key={plan.id} className={cn(
              "flex flex-col text-left transform hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden",
              plan.highlighted ? "border-accent shadow-accent/20 shadow-lg" : "border-border"
            )}>
              <div
                  className="absolute inset-0 bg-cover bg-center opacity-5"
                  style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2Fbc9bc6be-11b4-4125-bb38-668b9539b00c.png?alt=media')" }}
              />
              <div className="relative flex flex-col flex-grow">
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-4xl font-bold pt-4">{plan.price}<span className="text-sm font-normal text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span></CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-lg font-semibold text-primary mb-4">{plan.credits} credits</p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                         <div className="mt-1">
                            {feature.toLowerCase().includes('ad-free') || feature.toLowerCase().includes('api access') ? (
                                <Check className="h-5 w-5 text-green-500" />
                            ) : (
                                <Check className="h-5 w-5 text-muted-foreground" />
                            )}
                         </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handleChoosePlan(plan)}
                    variant={plan.highlighted ? 'accent' : 'outline'} 
                    className="w-full"
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
    </div>
  );
}
