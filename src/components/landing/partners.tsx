'use client';
import Image from 'next/image';
import Link from 'next/link';

const partners = [
    { 
        name: 'Google Gemini', 
        logo: 'https://logos-world.net/wp-content/uploads/2025/01/Google-Gemini-Logo.png',
        href: 'https://gemini.google.com/',
        width: 140,
        height: 40
    },
    { 
        name: 'OpenAI DALL-E 3', 
        logo: 'https://cdn.80.lv/api/upload/content/f5/663d87b3b199a.jpg',
        href: 'https://openai.com/dall-e-3',
        width: 120,
        height: 60
    },
    { 
        name: 'Stability AI', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Stability_Ai_%E2%80%94_wordmark.png',
        href: 'https://stability.ai/',
        width: 150,
        height: 40
    },
    { 
        name: 'Midjourney', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Midjourney_Emblem.svg',
        href: 'https://www.midjourney.com/',
        width: 120,
        height: 40
    },
];

const PartnerLogo = ({ name, logo, href, width, height }: { name: string, logo: string, href: string, width: number, height: number }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
        <div className="relative" style={{ width, height }}>
           <Image
            src={logo}
            alt={`${name} logo`}
            title={name}
            fill
            className="object-contain"
          />
        </div>
    </Link>
)

export default function Partners() {
    return (
        <section className="py-20 lg:py-24">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">Powered By Leading AI Models</h3>
                <div className="mt-8 flex justify-center items-center gap-8 md:gap-16 flex-wrap">
                    {partners.map(partner => (
                        <PartnerLogo key={partner.name} {...partner} />
                    ))}
                </div>
            </div>
        </section>
    );
}
