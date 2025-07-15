
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HeroSection from '@/components/landing/hero-section';
import GalleryPreview from '@/components/landing/gallery-preview';
import Partners from '@/components/landing/partners';
import Testimonials from '@/components/landing/testimonials';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brush, Gem, Sparkles } from 'lucide-react';
import ToolsSuite from '@/components/landing/tools-suite';
import SocialCta from '@/components/landing/social-cta';
import FeatureHighlight from '@/components/landing/feature-highlight';

const CtaSection = () => (
    <section className="py-20 lg:py-24 bg-card/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Explore Our Creative Universe</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                Dive deeper into the tools, pricing, and features that make VisionHub AI the ultimate platform for creators.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" variant="outline">
                    <Link href="/services">
                        <Brush className="mr-2"/> View Services
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/pricing">
                       <Gem className="mr-2"/> See Pricing
                    </Link>
                </Button>
                 <Button asChild size="lg" variant="accent">
                    <Link href="/about">
                       <Sparkles className="mr-2"/> About Us <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
            </div>
        </div>
    </section>
);


function LandingPage() {
    return (
        <>
            <HeroSection />
            <Partners />
            <ToolsSuite />
            <FeatureHighlight
                title="Image-to-Image Transformation"
                description="Upload an image and transform it with a text prompt into something entirely new. The future of iterative design is on its way."
                imageUrl="https://cdn.web.imagine.art/6c786763-941f-431e-b838-895180630b20"
                imageHint="robot dog future"
             />
             <FeatureHighlight
                title="AI Inpainting & Outpainting"
                description="Edit images with precision. Erase parts of an image and regenerate them with a new prompt, or expand your canvas infinitely. Perfect for making targeted changes."
                imageUrl="https://mir-s3-cdn-cf.behance.net/project_modules/1400/b383b3169312369.644a56a9a3b9d.jpg"
                imageHint="photo editing"
             />
             <FeatureHighlight
                title="Community Showcase"
                description="A vibrant space to share your creations, discover what others are making, and connect with fellow artists. Get ready to be inspired."
                imageUrl="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6wH0a88aNax9yS3E9KnIZ4pL3gGv8PUFL09224OAbRO_31M9P6TNMh2PqY0j2j5pXJ7A-o2S-AQd21s2p9y1Bq9y1Bq9y1Bq9y1Bq9y1Bq9y1Bq/s1600/image-generation-of-people-in-an-art-gallery-viewing-a-painting-of-a-beautiful-landscape_839178-52.jpg"
                imageHint="art gallery community"
             />
            <FeatureHighlight
                title="AI Video Generation"
                description="The next frontier of creativity. Our AI video tool will let you create dynamic clips from simple text prompts. The future of content creation is coming."
                imageUrl="https://storage.googleapis.com/gweb-aip-images/default-videos/gemini_1_5/gemini_1_5_hero_split_video_2_dark_desktop.mp4"
                imageHint="movie film"
                isVideo
             />
            <CtaSection />
            <Testimonials />
            <GalleryPreview />
            <SocialCta />
        </>
    );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  return <LandingPage />;
}
