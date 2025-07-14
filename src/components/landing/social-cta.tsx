
'use client';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';

export default function SocialCta() {
    return (
        <section className="py-20 bg-transparent">
            <div className="container mx-auto px-4">
                <Card className="bg-card/90 backdrop-blur-sm">
                    <CardContent className="p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4">Join Our Creative Community</h2>
                        <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
                            Connect with over 10K+ like-minded creators, share your work, and get inspired. Follow us on social media for the latest updates, tips, and showcases.
                        </p>
                        <div className="flex justify-center gap-6">
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
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
