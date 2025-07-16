'use client';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const partners = [
    { 
        name: 'Google Gemini', 
        logo: 'https://logos-world.net/wp-content/uploads/2025/01/Google-Gemini-Logo.png',
        href: 'https://gemini.google.com/',
        className: 'invert',
    },
    { 
        name: 'OpenAI DALL-E 3', 
        logo: 'https://cdn.80.lv/api/upload/content/f5/663d87b3b199a.jpg',
        href: 'https://openai.com/dall-e-3',
    },
    { 
        name: 'Stability AI', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Stability_Ai_%E2%80%94_wordmark.png',
        href: 'https://stability.ai/',
        className: 'invert'
    },
    { 
        name: 'Midjourney', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Midjourney_Emblem.svg',
        href: 'https://www.midjourney.com/',
        className: 'invert'
    },
];

const PartnerLogo = ({ name, logo, href, className }: { name: string, logo: string, href: string, className?: string }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="group">
        <div className="h-24 w-48 flex items-center justify-center p-4 bg-secondary rounded-lg transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/50 border border-transparent">
           <div className="relative h-16 w-full">
             <Image
                src={logo}
                alt={`${name} logo`}
                title={name}
                fill
                className={cn("object-contain", className)}
            />
           </div>
        </div>
    </Link>
)

export default function Partners() {
    return (
        <section className="py-20 lg:py-24">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">Powered By Leading AI Models</h3>
                <div className="mt-8 flex justify-center items-center gap-8 flex-wrap">
                    {partners.map(partner => (
                        <PartnerLogo key={partner.name} {...partner} />
                    ))}
                </div>
            </div>
        </section>
    );
}
