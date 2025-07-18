
'use client';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Edit, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

const plans = {
  monthly: [
    { id: 'price_starter_monthly', name: 'Starter', price: '$2', lkrPrice: '150', slashedPrice: '$4', lkrSlashedPrice: '300', credits: 100, features: ['100 credits', 'Supported by ads', 'Standard quality'] },
    { id: 'price_basic_monthly', name: 'Basic', price: '$10', lkrPrice: '800', slashedPrice: '$15', lkrSlashedPrice: '1200', credits: 500, features: ['Supported by ads', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_monthly', name: 'Standard', price: '$25', lkrPrice: '2000', slashedPrice: '$35', lkrSlashedPrice: '2800', credits: 1500, features: ['Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
    { id: 'price_premium_monthly', name: 'Premium', price: '$50', lkrPrice: '4000', slashedPrice: '$65', lkrSlashedPrice: '5200', credits: 4000, features: ['Ad-Free Experience', '4K+ resolution', 'API access', 'Dedicated support'] },
  ],
  annually: [
    { id: 'price_starter_annual', name: 'Starter', price: '$18', lkrPrice: '1500', slashedPrice: '$24', lkrSlashedPrice: '2000', credits: 100, features: ['100 credits/mo', 'Supported by ads', 'Standard quality'] },
    { id: 'price_basic_annual', name: 'Basic', price: '$96', lkrPrice: '7500', slashedPrice: '$120', lkrSlashedPrice: '9500', credits: 500, features: ['500 credits/mo', 'Supported by ads', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_annual', name: 'Standard', price: '$240', lkrPrice: '19000', slashedPrice: '$300', lkrSlashedPrice: '24000', credits: 1500, features: ['1500 credits/mo', 'Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
    { id: 'price_premium_annual', name: 'Premium', price: '$480', lkrPrice: '38000', slashedPrice: '$600', lkrSlashedPrice: '48000', credits: 4000, features: ['4000 credits/mo', 'Ad-Free Experience', '4K+ resolution', 'API access', 'Dedicated support'] },
  ],
};

const CustomPlanCard = () => (
    <Card className={cn(
      "flex flex-col text-left transform hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden border-border border-dashed"
    )}>
      <div className="relative flex flex-col flex-grow items-center justify-center text-center p-6">
        <div className="absolute inset-4 border-2 border-dashed border-border/50 rounded-lg" />
        <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
                <Edit className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Build Your Own Plan</CardTitle>
            <CardDescription>Need more? Contact us for a custom solution.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow w-full justify-end">
          <Button variant="outline" className="w-full mt-4">
            Contact Sales
          </Button>
        </CardContent>
      </div>
    </Card>
);


export function PricingClient() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLKR, setIsLKR] = useState(false);
  const { user, setAuthModalOpen } = useAuth();
  const router = useRouter();
  const [, setSelectedPlan] = useLocalStorage('selectedPlan', null);

  useEffect(() => {
    // Detect user's language to default to LKR if applicable
    if (typeof navigator !== 'undefined' && (navigator.language === 'si-LK' || navigator.language === 'ta-LK')) {
      setIsLKR(true);
    }
  }, []);
  
  const currentPlans = isAnnual ? plans.annually : plans.monthly;

  const handleChoosePlan = (plan: typeof currentPlans[0]) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const finalPrice = isLKR ? `LKR ${plan.lkrPrice}` : plan.price;
    const planDetails = {
      ...plan,
      price: finalPrice, // Store the final displayed price
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                  <CardDescription>
                      <div className="flex items-baseline gap-2 pt-4">
                        <span className="text-4xl font-bold text-foreground">
                            {isLKR ? `LKR ${plan.lkrPrice}` : plan.price}
                        </span>
                         <span className="line-through text-muted-foreground">
                            {isLKR ? `LKR ${plan.lkrSlashedPrice}` : plan.slashedPrice}
                        </span>
                      </div>
                      <span className="text-sm font-normal text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                   <p className="flex items-center gap-2 text-lg font-semibold text-primary mb-4">
                        <Gem className="h-5 w-5" />
                        {plan.credits.toLocaleString()} {isAnnual ? 'credits/mo' : 'credits'}
                    </p>
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
          <CustomPlanCard />
        </div>
    </div>
  );
}

