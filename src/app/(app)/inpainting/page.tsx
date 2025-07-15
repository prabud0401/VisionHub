
import { Metadata } from 'next';
import { ComingSoon } from '@/components/coming-soon';

export const metadata: Metadata = {
  title: 'Inpainting | VisionHub AI',
  description: 'Coming Soon: Advanced AI inpainting tool.',
};

export default function InpaintingPage() {
  return (
    <ComingSoon
      title="AI Inpainting Tool"
      description="Get ready to edit your images with precision. Our upcoming inpainting tool will allow you to erase parts of an image and regenerate them with a new prompt. Perfect for making targeted changes."
      imageUrl="https://placehold.co/600x400.png"
      imageHint="photo editing"
    />
  );
}
