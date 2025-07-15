
import { Metadata } from 'next';
import { ComingSoon } from '@/components/coming-soon';

export const metadata: Metadata = {
  title: 'Image-to-Image | VisionHub AI',
  description: 'Coming Soon: AI-powered image-to-image transformation.',
};

export default function ImageToImagePage() {
  return (
    <ComingSoon
      title="AI Image-to-Image Transformation"
      description="This powerful feature is currently under development. Soon, you'll be able to upload an image and transform it with a text prompt into something entirely new. Stay tuned!"
      imageUrl="https://placehold.co/600x400.png"
      imageHint="robot dog"
    />
  );
}
