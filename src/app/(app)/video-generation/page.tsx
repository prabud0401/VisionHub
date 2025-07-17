
import { VideoGenerationClient } from '@/components/video-generation-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Generation | VisionHub AI',
  description: 'Create dynamic videos from text prompts with AI.',
};

export default function VideoGenerationPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          AI Video Generation
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Describe your scene and watch our AI bring it to life in motion.
        </p>
      </div>
      <VideoGenerationClient />
    </div>
  );
}

