
import { DashboardClient } from '@/components/dashboard-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | VisionHub AI',
  description: 'Generate AI images from text prompts.',
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          AI Image Generation
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Describe your vision and let our AI bring it to life. Use the prompt enhancer for more creative results.
        </p>
      </div>
      <DashboardClient />
    </div>
  );
}
