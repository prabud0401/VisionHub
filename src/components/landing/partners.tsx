'use client';
import Image from 'next/image';

const partners = [
    { name: 'Gemini AI', logo: '/gemini.svg' },
    { name: 'OpenAI', logo: '/openai.svg' },
    { name: 'Stability AI', logo: '/stability-ai.svg' },
    { name: 'Midjourney', logo: '/midjourney.svg' },
];

const PartnerLogo = ({ name }: { name: string }) => (
    <div className="h-10 text-2xl flex items-center justify-center text-gray-400 font-headline grayscale hover:grayscale-0 transition-all duration-300">
        {name}
    </div>
)

export default function Partners() {
    return (
        <section className="py-20 bg-transparent">
            <div className="container mx-auto px-4 text-center">
                <h2 className="pixelated-font text-3xl font-bold tracking-tighter mb-4">Our Partners</h2>
                <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
                   We partner with the best in the industry to bring you cutting-edge AI image generation technology.
                </p>
                <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
                    <PartnerLogo name="Gemini AI" />
                    <PartnerLogo name="OpenAI" />
                    <PartnerLogo name="Stability AI" />
                    <PartnerLogo name="Midjourney" />
                </div>
            </div>
        </section>
    );
}
