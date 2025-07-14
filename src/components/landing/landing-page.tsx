'use client';
import HeaderUnauthenticated from '@/components/layout/header-unauthenticated';
import HeroSection from './hero-section';
import GalleryPreview from './gallery-preview';
import Partners from './partners';
import Testimonials from './testimonials';
import Footer from '../layout/footer';
import { AuthModal } from '../auth-modal';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight, Brush, Gem, Sparkles } from 'lucide-react';

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


export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
          <HeaderUnauthenticated />
          <main>
            <HeroSection />
            <Partners />
            <CtaSection />
            <Testimonials />
            <GalleryPreview />
          </main>
          <Footer />
          <AuthModal />
        </div>
    );
}
