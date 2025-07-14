'use client';
import { Gem } from 'lucide-react';

const OpenAI_Icon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
        <path d="M22.2819 9.8211a5.9841 5.9841 0 0 0-4.4816-4.4816c-2.924-1.2824-6.2343-1.2824-9.1583 0a5.9841 5.9841 0 0 0-4.4816 4.4816c-1.2824 2.924-1.2824 6.2343 0 9.1583a5.9841 5.9841 0 0 0 4.4816 4.4816c2.924 1.2824 6.2343 1.2824 9.1583 0a5.9841 5.9841 0 0 0 4.4816-4.4816c1.2824-2.924 1.2824-6.2343 0-9.1583zM8.3033 7.6983a1.4363 1.4363 0 0 1 1.4362-1.4362h4.5204a1.4363 1.4363 0 0 1 1.4362 1.4362v1.4362h-1.4362V7.6983h-3.0842v7.181h1.4362v1.4362H8.3033v-1.4362h1.4362V9.1345h-1.4362V7.6983zm0 0"/>
    </svg>
)

const StabilityAI_Icon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
      <path d="M20.572 17.144a1.002 1.002 0 0 0-.8-.4h-4.032a1 1 0 0 0-.792.408l-3.36 4.992a.5.5 0 0 1-.848 0l-3.36-4.992a1 1 0 0 0-.792-.408H2.57a1 1 0 0 0-.8.4 1 1 0 0 0 0 .816l4.224 6.288a1.5 1.5 0 0 0 1.272.752h8.568a1.5 1.5 0 0 0 1.272-.752l4.224-6.288a1 1 0 0 0 0-.816ZM3.427 6.856a1 1 0 0 0 .8.4h4.032a1 1 0 0 0 .792-.408l3.36-4.992a.5.5 0 0 1 .848 0l3.36 4.992a1 1 0 0 0 .792.408h4.032a1 1 0 0 0 .8-.4 1 1 0 0 0 0-.816L17.323-.248a1.5 1.5 0 0 0-1.272-.752H7.947a1.5 1.5 0 0 0-1.272.752L2.427 6.04a1 1 0 0 0 1 1.224Z"/>
    </svg>
)

const Midjourney_Icon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
        <path d="M22 17.554c-1.932 2.992-5.913 5.35-10.437 5.35-4.29 0-8.68-2.078-10.438-5.35h20.875zM12.33 1.096 22.203 16H2.438L12.33 1.096z"/>
    </svg>
)

const partners = [
    { name: 'Gemini AI', logo: <Gem className="h-8 w-8"/> },
    { name: 'OpenAI', logo: <OpenAI_Icon/> },
    { name: 'Stability AI', logo: <StabilityAI_Icon/> },
    { name: 'Midjourney', logo: <Midjourney_Icon/> },
];

const PartnerLogo = ({ name, logo }: { name: string, logo: React.ReactNode }) => (
    <div className="flex items-center gap-4 text-muted-foreground transition-all duration-300 hover:text-foreground">
        <div className="flex items-center justify-center">
            {logo}
        </div>
        <span className="text-lg font-medium">{name}</span>
    </div>
)

export default function Partners() {
    return (
        <section className="py-20 lg:py-24">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-sm font-semibold tracking-wider text-primary uppercase">Trusted by the best</h3>
                <div className="mt-8 flex justify-center items-start gap-8 md:gap-16 flex-wrap">
                    {partners.map(partner => (
                        <PartnerLogo key={partner.name} name={partner.name} logo={partner.logo} />
                    ))}
                </div>
            </div>
        </section>
    );
}
