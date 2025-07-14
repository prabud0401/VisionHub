'use client';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function SocialCta() {
    return (
        <section className="py-20 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-8 md:p-12 text-center">
                    <h2 className="pixelated-font text-2xl md:text-3xl font-bold tracking-tighter mb-4">Follow Us on Social Media</h2>
                    <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
                        Connect and share innovative ideas with over 10K+ creative like minded people.
                    </p>
                    <Button variant="accent" size="lg" className="mb-6">Follow Now</Button>
                    <div className="flex justify-center gap-6">
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin /></Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
