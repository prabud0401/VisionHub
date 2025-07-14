import { Metadata } from 'next';
import { PricingClient } from '@/components/pricing-client';

export const metadata: Metadata = {
  title: 'Pricing | VisionHub AI',
  description: 'Choose a plan that fits your creative needs.',
};

export default function PricingPage() {
  return (
    <div className="container mx-auto py-20 px-4">
       <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Flexible Plans for Every Creator
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose a plan that scales with your ambition. All plans include access to our full suite of AI tools.
        </p>
      </div>
      <PricingClient />
    </div>
  );
}
