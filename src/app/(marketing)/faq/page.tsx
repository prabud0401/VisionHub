
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Faq from '@/components/faq';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'FAQ | VisionHub AI',
  description: 'Find answers to frequently asked questions about VisionHub AI.',
};

export default function FaqPage() {
    return (
        <div className="container mx-auto max-w-4xl py-20 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text">
                    Frequently Asked Questions
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                    Find the answers to the most common questions about our platform.
                </p>
            </div>
            
            <Faq />

            <Card className="mt-16 text-center p-8 rounded-lg relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: "url('/images/about-hero.png')" }}
                 />
                <div className="absolute inset-0 bg-background/70" />
                <CardContent className="relative">
                    <h2 className="text-2xl font-bold">Still have questions?</h2>
                    <p className="mt-2 text-muted-foreground">
                        Our support team is here to help you on your creative journey.
                    </p>
                    <Button asChild size="lg" className="mt-6">
                        <Link href="#">Contact Support</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
