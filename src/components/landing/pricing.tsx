'use client';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

const plans = {
  monthly: [
    { name: 'Basic', price: '$10', features: ['500 credits', 'Standard quality', 'Limited access'] },
    { name: 'Standard', price: '$25', features: ['1500 credits', 'High quality', 'Full access', 'Priority support'], highlighted: true },
    { name: 'Premium', price: '$50', features: ['4000 credits', '4K+ quality', 'API access', 'Dedicated support'] },
  ],
  annually: [
    { name: 'Basic', price: '$96', features: ['500 credits/mo', 'Standard quality', 'Limited access'] },
    { name: 'Standard', price: '$240', features: ['1500 credits/mo', 'High quality', 'Full access', 'Priority support'], highlighted: true },
    { name: 'Premium', price: '$480', features: ['4000 credits/mo', '4K+ quality', 'API access', 'Dedicated support'] },
  ],
};

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { setAuthModalOpen } = useAuth();
  const currentPlans = isAnnual ? plans.annually : plans.monthly;

  return (
    <section id="pricing" className="py-20 bg-card/80 backdrop-blur-sm rounded-lg">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-primary font-semibold">OUR PRICING</h3>
        <h2 className="text-3xl font-bold font-headline mt-2 mb-6">Get Started with Our App</h2>
        
        <div className="flex items-center justify-center space-x-2 mb-12">
          <Label htmlFor="billing-toggle">Monthly</Label>
          <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
          <Label htmlFor="billing-toggle">Annually (Save 20%)</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {currentPlans.map((plan) => (
            <Card key={plan.name} className={cn(
              "flex flex-col text-left transform hover:-translate-y-2 transition-transform duration-300 bg-card/50 backdrop-blur-sm",
              plan.highlighted ? "border-accent shadow-accent/20 shadow-lg" : ""
            )}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-4xl font-bold pt-4">{plan.price}<span className="text-sm font-normal text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span></CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => setAuthModalOpen(true)}
                  variant={plan.highlighted ? 'accent' : 'outline'} 
                  className="w-full"
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
