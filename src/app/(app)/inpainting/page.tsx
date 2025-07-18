
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
      imageUrl="/images/coming-soon-inpainting.png"
      imageHint="A beautiful landscape photograph with a glowing area in the middle where a part of the scene is being magically erased and repainted by a digital brush. Focus on the tool's effect."
    />
  );
}
