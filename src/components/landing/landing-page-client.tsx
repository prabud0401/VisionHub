
'use client';

import { useAuth } from '@/context/auth-context';
import HeroSection from '@/components/landing/hero-section';
import Partners from '@/components/landing/partners';
import Testimonials from '@/components/landing/testimonials';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brush, Gem, Sparkles, Users, Image as ImageIcon, Wand2 } from 'lucide-react';
import ToolsSuite from '@/components/landing/tools-suite';
import SocialCta from '@/components/landing/social-cta';
import FeatureHighlight from '@/components/landing/feature-highlight';
import Image from 'next/image';
import { UseCaseShowcase } from '@/components/landing/use-case-showcase';
import GalleryPreview from './gallery-preview';

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

export default function LandingPageClient({ imagePaths }: { imagePaths: string[] }) {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
                <Image src="/images/load.png" alt="VisionHub Logo" width={200} height={50} />
                <p className="text-muted-foreground animate-pulse">Unleashing Creativity...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <HeroSection />
                <Partners />
                <UseCaseShowcase />
                <ToolsSuite />
                 <FeatureHighlight
                    title="Community Showcase"
                    description="A vibrant space to share your creations, discover what others are making, and connect with fellow artists. Get ready to be inspired."
                    imageUrl="/images/Community Showcase.png"
                    imageHint="A digital art gallery wall showcasing many different styles of AI-generated art. The gallery is clean, modern, and well-lit. People are milling around looking at the art."
                    isLive
                    buttonLink="/community"
                    buttonText="Explore the Showcase"
                    buttonIcon={<Users />}
                 />
                <FeatureHighlight
                    title="Image-to-Image Transformation"
                    description="Upload an image and transform it with a text prompt into something entirely new. The future of iterative design is here."
                    imageUrl="/images/Image-to-Image Transformation.png"
                    imageHint="A magical transformation effect showing a photo of a real-world object (like a teacup) turning into a fantastical, artistic version of itself. Glowing particles and light trails."
                    isLive
                    buttonLink="/dashboard"
                    buttonText="Try it Now"
                    buttonIcon={<ImageIcon />}
                 />
                 <FeatureHighlight
                    title="AI Inpainting & Outpainting"
                    description="Edit images with precision. Erase parts of an image and regenerate them with a new prompt, or expand your canvas infinitely. Perfect for making targeted changes."
                    imageUrl="/images/AI Inpainting & Outpainting.png"
                    imageHint="A beautiful landscape photo being expanded. The original photo is in the center, and the AI is generating new scenery on all sides to make the image wider. The new parts blend seamlessly."
                 />
                <FeatureHighlight
                    title="AI Video Generation"
                    description="The next frontier of creativity. Our AI video tool will let you create dynamic clips from simple text prompts. The future of content creation is coming."
                    imageUrl="/images/AI Video Generation.png"
                    imageHint="An abstract representation of video creation. A film strip is twisting and turning, with vibrant, colorful galaxies and nebulae visible inside each frame. Symbolizes creating worlds."
                 />
                <CtaSection />
                <Testimonials />
                <GalleryPreview imagePaths={imagePaths} />
                <SocialCta />
            </main>
        </div>
    );
}
