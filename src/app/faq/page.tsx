import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Faq from '@/components/faq';

export const metadata: Metadata = {
  title: 'FAQ | VisionHub AI',
  description: 'Find answers to frequently asked questions about VisionHub AI.',
};

export default function FaqPage() {
    return (
        <div className="container mx-auto max-w-4xl py-20 px-4">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
                    Frequently Asked Questions
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Find the answers to the most common questions about our platform.
                </p>
            </div>
            
            <Faq />

            <div className="mt-16 text-center bg-card p-8 rounded-lg">
                <h2 className="text-2xl font-bold">Still have questions?</h2>
                <p className="mt-2 text-muted-foreground">
                    Our support team is here to help you on your creative journey.
                </p>
                <Button size="lg" className="mt-6">Contact Support</Button>
            </div>
        </div>
    );
}
