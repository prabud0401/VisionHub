import { BackgroundRemoverClient } from '@/components/background-remover-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Background Remover | VisionHub AI',
  description: 'Remove backgrounds from your images with one click.',
};

export default function BackgroundRemoverPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          AI Background Remover
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Upload an image and our AI will automatically remove the background for you.
        </p>
      </div>
      <BackgroundRemoverClient />
    </div>
  );
}
