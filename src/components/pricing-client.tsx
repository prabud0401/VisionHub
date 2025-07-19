
'use client';
import { useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Gem, Mail, Edit, ShieldCheck, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Slider } from './ui/slider';

const plans = {
  monthly: [
    { id: 'price_starter_monthly', name: 'Starter', price: '$2', originalPrice: '$4', lkrPrice: 'LKR 600', credits: 100, features: ['100 credits', 'Supported by ads', 'Standard quality'] },
    { id: 'price_basic_monthly', name: 'Basic', price: '$10', originalPrice: '$15', lkrPrice: 'LKR 3,000', credits: 500, features: ['500 credits/mo', 'Supported by ads', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_monthly', name: 'Standard', price: '$25', originalPrice: '$35', lkrPrice: 'LKR 7,500', credits: 1500, features: ['1500 credits/mo', 'Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
  ],
  annually: [
    { id: 'price_starter_annual', name: 'Starter', price: '$20', originalPrice: '$48', lkrPrice: 'LKR 6,000', credits: 100, features: ['100 credits/mo', 'Supported by ads', 'Standard quality'] },
    { id: 'price_basic_annual', name: 'Basic', price: '$96', originalPrice: '$180', lkrPrice: 'LKR 28,800', credits: 500, features: ['500 credits/mo', 'Supported by ads', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_annual', name: 'Standard', price: '$240', originalPrice: '$420', lkrPrice: 'LKR 72,000', credits: 1500, features: ['1500 credits/mo', 'Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
  ],
};

const CustomPlanCard = ({ isAnnual, isLKR }: { isAnnual: boolean, isLKR: boolean }) => {
  const [credits, setCredits] = useState(5000);
  const [adFree, setAdFree] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [apiAccess, setApiAccess] = useState(false);
  
  const { user, setAuthModalOpen } = useAuth();
  const router = useRouter();
  const [, setSelectedPlan] = useLocalStorage('selectedPlan', null);

  const calculatePrice = useMemo(() => {
    let price = 0;
    // Credit cost: ~$0.01 per credit
    price += credits * 0.01;
    if (adFree) price += 5;
    if (highQuality) price += 10;
    if (apiAccess) price += 20;

    if (isAnnual) price *= 0.8 * 12;

    return Math.round(price);
  }, [credits, adFree, highQuality, apiAccess, isAnnual]);

  const handlePurchase = () => {
     if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const priceString = isLKR ? `LKR ${(calculatePrice * 300).toLocaleString()}` : `$${calculatePrice}`;
    const planDetails = {
      id: 'custom_plan',
      name: 'Custom Plan',
      price: priceString,
      credits: credits,
      billing: isAnnual ? 'annually' : 'monthly',
      features: [
          `${credits.toLocaleString()} credits/mo`,
          adFree && 'Ad-Free Experience',
          highQuality && 'High Quality Outputs',
          apiAccess && 'API Access'
      ].filter(Boolean)
    };
    setSelectedPlan(planDetails);
    router.push('/buy-credits');
  }

  return (
    <Card className="flex flex-col text-center transform hover:-translate-y-2 transition-transform duration-300 border-primary shadow-primary/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
        <CardHeader className="relative z-10">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full mx-auto flex items-center justify-center mb-4 ring-4 ring-primary/10">
                <Edit className="w-8 h-8"/>
            </div>
            <CardTitle className="text-2xl">Build Your Own Plan</CardTitle>
            <CardDescription>Tailor a plan that fits your exact needs.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow relative z-10 space-y-6">
            <div className="space-y-4 text-left">
                <div className="flex justify-between items-center">
                    <Label htmlFor="credits-slider" className="font-semibold">Credits</Label>
                    <span className="flex items-center gap-2 font-bold text-primary">
                        <Gem className="h-4 w-4" />{credits.toLocaleString()}
                    </span>
                </div>
                <Slider 
                    id="credits-slider" 
                    value={[credits]} 
                    onValueChange={([val]) => setCredits(val)} 
                    min={100} 
                    max={10000} 
                    step={100} 
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="ad-free-switch" className="flex items-center gap-2"><ShieldCheck /> Ad-Free</Label>
                    <Switch id="ad-free-switch" checked={adFree} onCheckedChange={setAdFree} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="high-quality-switch" className="flex items-center gap-2"><Star /> High Quality</Label>
                    <Switch id="high-quality-switch" checked={highQuality} onCheckedChange={setHighQuality} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="api-access-switch" className="flex items-center gap-2"><Zap /> API Access</Label>
                    <Switch id="api-access-switch" checked={apiAccess} onCheckedChange={setApiAccess} />
                </div>
            </div>
            
            <div className="!mt-auto pt-6">
                <CardDescription>Billed {isAnnual ? 'Annually' : 'Monthly'}</CardDescription>
                <p className="text-4xl font-bold text-foreground">
                    {isLKR ? `LKR ${(calculatePrice * 300).toLocaleString()}` : `$${calculatePrice}`}
                </p>
                <Button className="w-full mt-4" onClick={handlePurchase}>Purchase Custom Plan</Button>
            </div>
        </CardContent>
    </Card>
  )
}

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {currentPlans.map((plan) => (
            <Card key={plan.id} className={cn(
              "flex flex-col text-center transform hover:-translate-y-2 transition-transform duration-300",
              plan.highlighted ? "border-primary shadow-primary/20 shadow-lg" : "border-border"
            )}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                    <div className="flex justify-center items-end gap-2">
                        <span className="text-4xl font-bold text-foreground">
                            {isLKR ? plan.lkrPrice : plan.price}
                        </span>
                         {plan.originalPrice && <span className="text-lg line-through text-muted-foreground">{isLKR ? '' : plan.originalPrice}</span>}
                    </div>
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
          <CustomPlanCard isAnnual={isAnnual} isLKR={isLKR} />
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
