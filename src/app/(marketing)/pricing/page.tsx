
'use client';

import { Metadata } from 'next';
import { PricingClient } from '@/components/pricing-client';
import { FeatureComparison } from '@/components/feature-comparison';
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const LazyFeatureComparison = React.lazy(() => 
  import('@/components/feature-comparison').then(module => ({ default: module.FeatureComparison }))
);

// export const metadata: Metadata = { // metadata export is not allowed in client components
//   title: 'Pricing | VisionHub AI',
//   description: 'Choose a plan that fits your creative needs and compare features.',
// };

export default function PricingPage() {
  return (
    <div className="container mx-auto py-20 px-4">
       <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text">
          Flexible Plans for Every Creator
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that scales with your ambition. All plans include access to our full suite of AI tools.
        </p>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <PricingClient />
      </Suspense>
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }>
        <LazyFeatureComparison />
      </Suspense>
    </div>
  );
}
