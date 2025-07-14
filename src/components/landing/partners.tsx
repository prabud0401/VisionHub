'use client';
import { Bot, Gem, ShieldCheck } from 'lucide-react';

const OpenAI_Icon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <path d="M22.2819 9.8211a5.9841 5.9841 0 0 0-4.4816-4.4816c-2.924-1.2824-6.2343-1.2824-9.1583 0a5.9841 5.9841 0 0 0-4.4816 4.4816c-1.2824 2.924-1.2824 6.2343 0 9.1583a5.9841 5.9841 0 0 0 4.4816 4.4816c2.924 1.2824 6.2343 1.2824 9.1583 0a5.9841 5.9841 0 0 0 4.4816-4.4816c1.2824-2.924 1.2824-6.2343 0-9.1583zM8.3033 7.6983a1.4363 1.4363 0 0 1 1.4362-1.4362h4.5204a1.4363 1.4363 0 0 1 1.4362 1.4362v1.4362h-1.4362V7.6983h-3.0842v7.181h1.4362v1.4362H8.3033v-1.4362h1.4362V9.1345h-1.4362V7.6983zm0 0"/>
    </svg>
)

const Midjourney_Icon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <path d="M22 17.554c-1.932 2.992-5.913 5.35-10.437 5.35-4.29 0-8.68-2.078-10.438-5.35h20.875zM12.33 1.096 22.203 16H2.438L12.33 1.096z"/>
    </svg>
)

const partners = [
    { name: 'Gemini AI', logo: <Gem/> },
    { name: 'OpenAI', logo: <OpenAI_Icon/> },
    { name: 'Stability AI', logo: <ShieldCheck/> },
    { name: 'Midjourney', logo: <Midjourney_Icon/> },
];

const PartnerLogo = ({ name, logo }: { name: string, logo: React.ReactNode }) => (
    <div className="flex flex-col items-center gap-4 text-gray-400 font-headline grayscale hover:grayscale-0 transition-all duration-300">
        <div className="h-10 w-10 flex items-center justify-center">
            {logo}
        </div>
        <span className="text-lg">{name}</span>
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
                <div className="flex justify-center items-start gap-8 md:gap-16 flex-wrap">
                    {partners.map(partner => (
                        <PartnerLogo key={partner.name} name={partner.name} logo={partner.logo} />
                    ))}
                </div>
            </div>
        </section>
    );
}
