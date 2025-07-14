
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
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Your Image Gallery
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Here are all the amazing images you've created with VisionHub AI.
        </p>
      </div>
      <GalleryClient />
    </div>
  );
}
