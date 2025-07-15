
import { Metadata } from 'next';
import { ComingSoon } from '@/components/coming-soon';

export const metadata: Metadata = {
  title: 'Video Generation | VisionHub AI',
  description: 'Coming Soon: AI-powered text-to-video generation.',
};

export default function VideoGenerationPage() {
  return (
    <ComingSoon
      title="AI Video Generation"
      description="The next frontier of creativity is on its way. Our AI video generation tool will let you create dynamic video clips from simple text prompts. The future of content creation is coming soon."
      imageUrl="https://placehold.co/600x400.png"
      imageHint="movie film"
    />
  );
}
