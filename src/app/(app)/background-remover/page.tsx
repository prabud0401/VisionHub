
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
        <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text">
          AI Image Upgrade Suite
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Upscale, resize, and remove backgrounds with the power of AI.
        </p>
      </div>
      <ImageUpgradeClient />
    </div>
  );
}
