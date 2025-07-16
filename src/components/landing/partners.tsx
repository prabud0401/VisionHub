
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const OpenAI_SVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-green-500">
        <path d="M414.243 966.425C304.093 963.991 207.234 919.851 131.784 844.401C56.3341 768.951 12.1939 672.093 9.75991 561.943C7.32591 451.793 51.4661 354.934 126.916 279.484C202.366 204.034 299.225 159.894 409.375 157.46C519.525 155.026 616.384 199.166 691.834 274.616C767.284 350.066 811.424 446.925 813.858 557.075L582.029 557.075C579.595 506.925 561.054 461.645 529.934 429.935C498.814 398.225 455.525 381.861 409.375 381.861C366.086 381.861 326.686 397.711 296.866 426.045C267.046 454.379 251.186 493.778 251.186 537.075C251.186 580.371 267.046 619.771 296.866 648.105C326.686 676.439 366.086 692.288 409.375 692.288C455.525 692.288 498.814 675.925 529.934 644.215C549.954 624.195 563.744 600.286 571.304 572.486L813.858 572.486C802.758 676.865 753.827 766.384 676.166 833.324C600.939 898.921 511.075 941.318 414.243 966.425Z" />
        <path d="M604.664 507.039L720.559 391.145L836.454 507.039L952.348 391.145L836.454 275.25L720.559 391.145L604.664 275.25L488.77 391.145L604.664 507.039Z" />
        <path d="M488.77 157.46L604.664 41.5658L720.559 157.46L836.454 41.5658L720.559 -74.3286L604.664 41.5658L488.77 -74.3286L372.876 41.5658L488.77 157.46Z" />
    </svg>
)

const Midjourney_SVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-white stroke-[0.5]">
        <path d="M12 21.9134C11.3855 21.4396 10.8461 20.8461 10.4396 20.1812L2.08663 5.81883C1.68019 5.15392 1.38555 4.38548 1.25 3.58659" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.5604 20.1812C13.1539 20.8461 12.6145 21.4396 12 21.9134" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22.75 3.58659C22.6145 4.38548 22.3198 5.15392 21.9134 5.81883L13.5604 20.1812" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 3.91339H22" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const PartnerLogo = ({ name, children }: { name: string, children: React.ReactNode }) => (
    <div className="h-12 w-48 transition-transform duration-300 hover:scale-110 flex items-center justify-center" title={name}>
        {children}
    </div>
)

export default function Partners() {
    return (
        <section className="py-20 lg:py-24">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">Powered By Leading AI Models</h3>
                <div className="mt-8 flex justify-center items-center gap-12 flex-wrap">
                    <PartnerLogo name="Google Gemini">
                         <Link href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="h-full w-full relative">
                            <Image
                                src="https://logos-world.net/wp-content/uploads/2025/01/Google-Gemini-Logo.png"
                                alt="Google Gemini logo"
                                fill
                                className="object-contain"
                            />
                        </Link>
                    </PartnerLogo>
                    <PartnerLogo name="OpenAI">
                        <Link href="https://openai.com/" target="_blank" rel="noopener noreferrer" className="h-8 w-auto">
                            <OpenAI_SVG />
                        </Link>
                    </PartnerLogo>
                     <PartnerLogo name="Stability AI">
                        <Link href="https://stability.ai/" target="_blank" rel="noopener noreferrer" className="text-4xl font-bold tracking-tighter">
                           <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">Stability AI</span>
                        </Link>
                    </PartnerLogo>
                    <PartnerLogo name="Midjourney">
                         <Link href="https://www.midjourney.com/" target="_blank" rel="noopener noreferrer" className="h-10 w-auto">
                            <Midjourney_SVG />
                        </Link>
                    </PartnerLogo>
                </div>
            </div>
        </section>
    );
}

