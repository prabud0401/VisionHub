'use client';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const partners = [
    { 
        name: 'Google Gemini', 
        logo: 'https://logos-world.net/wp-content/uploads/2025/01/Google-Gemini-Logo.png',
        href: 'https://gemini.google.com/',
    },
    { 
        name: 'OpenAI', 
        logo: 'https://socialmarketing90.com/wp-content/uploads/2023/12/OpenAI-Insta-Version-SVG-13.svg',
        href: 'https://openai.com/',
        className: 'invert'
    },
    { 
        name: 'Stability AI', 
        logo: 'https://res.cloudinary.com/sup/image/upload/v1674538939/uikdmhg2fm1yfdzpoud4.png',
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
        <div className="relative h-12 w-48 transition-transform duration-300 group-hover:scale-110">
           <Image
            src={logo}
            alt={`${name} logo`}
            title={name}
            fill
            className={cn("object-contain", className)}
           />
        </div>
    </Link>
)

export default function Partners() {
    return (
        <section className="py-20 lg:py-24">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">Powered By Leading AI Models</h3>
                <div className="mt-8 flex justify-center items-center gap-12 flex-wrap">
                    {partners.map(partner => (
                        <PartnerLogo key={partner.name} {...partner} />
                    ))}
                </div>
            </div>
        </section>
    );
}
