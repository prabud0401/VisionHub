
import { GalleryClient } from '@/components/gallery-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | VisionHub AI',
  description: 'Browse your generated images.',
};

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text">
          Your Image Gallery
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Here are all the amazing images you've created with VisionHub AI.
        </p>
      </div>
      <GalleryClient />
    </div>
  );
}
