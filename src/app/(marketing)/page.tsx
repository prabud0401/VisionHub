
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
import Image from 'next/image';

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
                imageUrl="https://content-management-files.canva.com/cdn-cgi/image/f=auto,q=70/0a2c17ca-80f9-4240-b869-02980bf87112/magic-photo_promo-showcase_012x.png"
                imageHint="robot dog future"
             />
             <FeatureHighlight
                title="AI Inpainting & Outpainting"
                description="Edit images with precision. Erase parts of an image and regenerate them with a new prompt, or expand your canvas infinitely. Perfect for making targeted changes."
                imageUrl="https://blog.segmind.com/content/images/2023/08/Untitled-document--1-_pages-to-jpg-0001.jpg"
                imageHint="photo editing"
             />
             <FeatureHighlight
                title="Community Showcase"
                description="A vibrant space to share your creations, discover what others are making, and connect with fellow artists. Get ready to be inspired."
                imageUrl="https://www.dignited.com/wp-content/uploads/2023/01/midjourney-community-showcase-1024x591.jpeg"
                imageHint="art gallery community"
             />
            <FeatureHighlight
                title="AI Video Generation"
                description="The next frontier of creativity. Our AI video tool will let you create dynamic clips from simple text prompts. The future of content creation is coming."
                imageUrl="https://blogs-cdn.imagine.art/feature_image_0ddefd1491.png"
                imageHint="movie film"
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
      <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
        <Image src="/load.png" alt="VisionHub Logo" width={240} height={60} />
        <p className="text-muted-foreground animate-pulse">Unleashing Creativity...</p>
      </div>
    );
  }

  return <LandingPage />;
}
