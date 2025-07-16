'use client';
import Image from 'next/image';
import Link from 'next/link';

const partners = [
    {
        name: "Google Gemini",
        href: "https://gemini.google.com/",
        component: (
            <div className="h-full w-full relative">
                <Image
                    src="https://logos-world.net/wp-content/uploads/2025/01/Google-Gemini-Logo.png"
                    alt="Google Gemini logo"
                    fill
                    className="object-contain"
                />
            </div>
        )
    },
    {
        name: "OpenAI",
        href: "https://openai.com/",
        component: (
            <div className="flex items-center gap-3">
                <div className="relative h-8 w-8">
                <Image
                    src="https://socialmarketing90.com/wp-content/uploads/2023/12/OpenAI-Insta-Version-SVG-3.svg"
                    alt="OpenAI Icon"
                    fill
                    className="object-contain"
                />
                </div>
                <span className="text-3xl font-bold">OpenAI</span>
            </div>
        )
    },
    {
        name: "Stability AI",
        href: "https://stability.ai/",
        component: (
            <span className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                stability<span className="text-blue-500">.</span>ai
            </span>
        )
    },
    {
        name: "Midjourney",
        href: "https://www.midjourney.com/",
        component: (
             <div className="flex items-center gap-3">
                <div className="relative h-10 w-10">
                    <Image
                    src="https://companieslogo.com/img/orig/midjourney.D-733962ee.png?t=1720244494"
                    alt="Midjourney Icon"
                    fill
                    className="object-contain invert"
                    />
                </div>
                <span className="text-3xl font-bold">Midjourney</span>
            </div>
        )
    }
];

const PartnerLogo = ({ name, href, children }: { name: string, href: string, children: React.ReactNode }) => (
    <Link 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center justify-center h-16 w-48 transition-transform duration-300 hover:scale-105"
        title={name}
    >
        {children}
    </Link>
);


export default function Partners() {
    return (
        <section className="py-20 lg:py-24">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">Powered By Leading AI Models</h3>
                
                {/* Desktop view */}
                <div className="mt-8 hidden md:flex justify-center items-center gap-x-12 gap-y-8 flex-wrap">
                    {partners.map(p => (
                        <PartnerLogo key={p.name} name={p.name} href={p.href}>
                            {p.component}
                        </PartnerLogo>
                    ))}
                </div>

                {/* Mobile Marquee view */}
                <div className="md:hidden mt-8 relative flex w-full overflow-x-hidden">
                    <div className="flex w-max animate-marquee-slow py-4">
                        {[...partners, ...partners].map((p, index) => (
                             <div key={`${p.name}-${index}`} className="mx-6 flex-shrink-0">
                                <PartnerLogo name={p.name} href={p.href}>
                                    {p.component}
                                </PartnerLogo>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}