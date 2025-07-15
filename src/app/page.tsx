
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
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

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
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 pt-20">
                <HeroSection />
                <Partners />
                <ToolsSuite />
                <CtaSection />
                <Testimonials />
                <GalleryPreview />
                <SocialCta />
            </main>
            <Footer />
        </div>
    );
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    // Return a loader or null while redirecting
    return (
       <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  return <LandingPage />;
}
