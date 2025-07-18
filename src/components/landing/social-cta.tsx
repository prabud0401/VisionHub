
'use client';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';

export default function SocialCta() {
    return (
        <section className="py-20 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <Card className="bg-card/90 backdrop-blur-sm overflow-hidden relative">
                         <div
                            className="absolute inset-0 bg-cover bg-center opacity-10"
                            style={{ backgroundImage: "url('/images/cta-background.png')" }}
                         />
                        <div className="absolute inset-0 bg-background/50" />
                        <CardContent className="p-0 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                                <div className="p-8 md:p-12 text-center md:text-left">
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4">Join Our Creative Community</h2>
                                    <p className="max-w-2xl mx-auto md:mx-0 text-muted-foreground mb-8">
                                        Connect with over 10K+ like-minded creators, share your work, and get inspired. Follow us on social media for the latest updates, tips, and showcases.
                                    </p>
                                    <div className="flex justify-center md:justify-start gap-6">
                                        <Button asChild variant="outline" size="icon" className="h-12 w-12 rounded-full">
                                            <Link href="#" aria-label="Facebook"><Facebook /></Link>
                                        </Button>
                                        <Button asChild variant="outline" size="icon" className="h-12 w-12 rounded-full">
                                            <Link href="#" aria-label="Twitter"><Twitter /></Link>
                                        </Button>
                                        <Button asChild variant="outline" size="icon" className="h-12 w-12 rounded-full">
                                            <Link href="#" aria-label="Instagram"><Instagram /></Link>
                                        </Button>
                                        <Button asChild variant="outline" size="icon" className="h-12 w-12 rounded-full">
                                            <Link href="#" aria-label="LinkedIn"><Linkedin /></Link>
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative h-64 md:h-full w-full">
                                    <Image
                                        src="/images/social-cta-image.png"
                                        alt="A vibrant community of creators"
                                        data-ai-hint="An abstract artwork representing a connected community. Many colorful, glowing strands of light weave together into a beautiful, complex pattern. Symbolizes connection and creativity."
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
