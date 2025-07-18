
'use client';
import { useState, useEffect, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Edit, Gem, ShieldCheck, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Slider } from './ui/slider';

const plans = {
  monthly: [
    { id: 'price_starter_monthly', name: 'Starter', price: '$2', lkrPrice: '150', slashedPrice: '$4', lkrSlashedPrice: '300', credits: 100, features: ['100 credits', 'Supported by ads', 'Standard quality'] },
    { id: 'price_basic_monthly', name: 'Basic', price: '$10', lkrPrice: '800', slashedPrice: '$15', lkrSlashedPrice: '1200', credits: 500, features: ['Supported by ads', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_monthly', name: 'Standard', price: '$25', lkrPrice: '2000', slashedPrice: '$35', lkrSlashedPrice: '2800', credits: 1500, features: ['Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
  ],
  annually: [
    { id: 'price_starter_annual', name: 'Starter', price: '$18', lkrPrice: '1500', slashedPrice: '$24', lkrSlashedPrice: '2000', credits: 100, features: ['100 credits/mo', 'Supported by ads', 'Standard quality'] },
    { id: 'price_basic_annual', name: 'Basic', price: '$96', lkrPrice: '7500', slashedPrice: '$120', lkrSlashedPrice: '9500', credits: 500, features: ['500 credits/mo', 'Supported by ads', 'Standard quality', 'Limited access to models'] },
    { id: 'price_standard_annual', name: 'Standard', price: '$240', lkrPrice: '19000', slashedPrice: '$300', lkrSlashedPrice: '24000', credits: 1500, features: ['1500 credits/mo', 'Ad-Free Experience', 'High quality outputs', 'Full access to models', 'Priority support'], highlighted: true },
  ],
};

const CustomPlanBuilder = ({ isLKR, billing, onChoosePlan }: { isLKR: boolean, billing: 'monthly' | 'annually', onChoosePlan: (plan: any) => void }) => {
    const [credits, setCredits] = useState(5000);
    const [isAdFree, setIsAdFree] = useState(true);
    const [isHighQuality, setIsHighQuality] = useState(true);
    const [hasApiAccess, setHasApiAccess] = useState(false);
    const [price, setPrice] = useState(0);

    const priceConfig = {
        creditBase: isLKR ? 0.8 : 0.01,
        adFreeMultiplier: 1.2,
        highQualityMultiplier: 1.5,
        apiAccessMultiplier: 2.0,
        annualDiscount: 0.8,
    };

    useEffect(() => {
        let calculatedPrice = credits * priceConfig.creditBase;
        if (isAdFree) calculatedPrice *= priceConfig.adFreeMultiplier;
        if (isHighQuality) calculatedPrice *= priceConfig.highQualityMultiplier;
        if (hasApiAccess) calculatedPrice *= priceConfig.apiAccessMultiplier;
        if (billing === 'annually') calculatedPrice *= priceConfig.annualDiscount;
        
        setPrice(parseFloat(calculatedPrice.toFixed(2)));
    }, [credits, isAdFree, isHighQuality, hasApiAccess, billing, isLKR, priceConfig]);

    const handlePurchase = () => {
        const customPlan = {
            id: 'custom-plan',
            name: 'Custom Plan',
            price: isLKR ? `LKR ${Math.round(price)}` : `$${price}`,
            credits: credits,
            billing: billing,
            features: [
                `${credits.toLocaleString()} credits`,
                isAdFree ? 'Ad-Free Experience' : 'Supported by ads',
                isHighQuality ? 'High quality outputs' : 'Standard quality',
                hasApiAccess ? 'API Access' : 'No API Access',
            ]
        };
        onChoosePlan(customPlan);
    }

    return (
        <Card className={cn(
          "flex flex-col text-left transform hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden border-border border-dashed",
          "lg:col-span-1 md:col-span-2"
        )}>
            <div className="relative flex flex-col flex-grow p-6">
                <CardHeader className="p-0 pb-6">
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4 w-fit">
                        <Edit className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl text-center">Build Your Own Plan</CardTitle>
                    <CardDescription className="text-center">Tailor a plan that fits your exact needs.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex flex-col flex-grow">
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="credits-slider" className="flex justify-between items-center mb-4">
                                <span>Credits</span>
                                <span className="font-bold text-primary text-lg flex items-center gap-1">
                                    <Gem className="h-4 w-4" /> {credits.toLocaleString()}
                                </span>
                            </Label>
                            <Slider
                                id="credits-slider"
                                min={500}
                                max={20000}
                                step={100}
                                value={[credits]}
                                onValueChange={(value) => setCredits(value[0])}
                            />
                        </div>
                        <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                <Label htmlFor="ad-free" className="flex items-center gap-2"><ShieldCheck /> Ad-Free</Label>
                                <Switch id="ad-free" checked={isAdFree} onCheckedChange={setIsAdFree} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="high-quality" className="flex items-center gap-2"><Star /> High Quality</Label>
                                <Switch id="high-quality" checked={isHighQuality} onCheckedChange={setIsHighQuality} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="api-access" className="flex items-center gap-2"><Zap /> API Access</Label>
                                <Switch id="api-access" checked={hasApiAccess} onCheckedChange={setHasApiAccess} />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-0 pt-6 mt-auto flex flex-col items-center">
                     <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">{billing === 'annually' ? 'Billed Annually' : 'Billed Monthly'}</p>
                        <p className="text-4xl font-bold">
                            {isLKR ? `LKR ${Math.round(price)}` : `$${price}`}
                        </p>
                    </div>
                    <Button onClick={handlePurchase} className="w-full">
                        Purchase Custom Plan
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
};


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
  const billingCycle = isAnnual ? 'annually' : 'monthly';

  const handleChoosePlan = (plan: typeof currentPlans[0] | any) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const finalPrice = plan.price || (isLKR ? `LKR ${plan.lkrPrice}` : plan.price);
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
          <CustomPlanBuilder isLKR={isLKR} billing={billingCycle} onChoosePlan={handleChoosePlan} />
        </div>
    </div>
  );
}
