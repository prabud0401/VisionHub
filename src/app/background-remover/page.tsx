import { ImageUpgradeClient } from '@/components/image-upgrade-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Upgrade | VisionHub AI',
  description: 'Upscale, resize, and remove backgrounds from your images with AI.',
};

export default function ImageUpgradePage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          AI Image Upgrade Suite
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Upscale, resize, and remove backgrounds with the power of AI.
        </p>
      </div>
      <ImageUpgradeClient />
    </div>
  );
}
