
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
        <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text">
          AI Video Generation
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Describe your scene and watch our AI bring it to life in motion.
        </p>
      </div>
      <VideoGenerationClient />
    </div>
  );
}
