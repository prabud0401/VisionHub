
import { DashboardContainer } from '@/components/dashboard/dashboard-container';
import { ErrorBoundary } from '@/components/error-boundary';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | VisionHub AI',
  description: 'Generate AI images from text prompts.',
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text">
          AI Image Generation
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Describe your vision and let our AI bring it to life. Use the prompt enhancer for more creative results.
        </p>
      </div>
      <ErrorBoundary>
        <DashboardContainer />
      </ErrorBoundary>
    </div>
  );
}
