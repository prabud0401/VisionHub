
import { Metadata } from 'next';
import { ComingSoon } from '@/components/coming-soon';

export const metadata: Metadata = {
  title: 'Community | VisionHub AI',
  description: 'Coming Soon: A showcase of community creations.',
};

export default function CommunityPage() {
  return (
    <ComingSoon
      title="Community Showcase"
      description="Inspiration awaits! We're building a vibrant space where you can share your best creations, discover what others are making, and connect with fellow artists. Get ready to be inspired."
      imageUrl="https://placehold.co/600x400.png"
      imageHint="art gallery"
    />
  );
}
