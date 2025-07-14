'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

const images = [
  'https://placehold.co/1920x1080.png',
  'https://placehold.co/1920x1080.png',
  'https://placehold.co/1920x1080.png',
];

const dataAiHints = [
  'fantasy landscape',
  'futuristic portrait',
  'abstract art',
]

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const { setAuthModalOpen } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  const handleCreate = () => {
    setAuthModalOpen(true);
  };

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center text-white">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`AI generated art ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          priority={index === 0}
          data-ai-hint={dataAiHints[index]}
        />
      ))}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">VisionHub AI Image Generator</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">
          Create AI Art and turn your imaginations into reality with VisionHub's AI Art Generator and produce stunning visuals to cover up your artistic thoughts.
        </p>
        <div className="max-w-2xl mx-auto flex items-center gap-2 bg-background/50 p-2 rounded-lg border border-border">
          <Input 
            type="text" 
            placeholder="a cyberpunk dystopia with a sprawling, rain-soaked cityscape"
            className="flex-grow bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-muted-foreground"
          />
          <Button variant="accent" size="lg" onClick={handleCreate}>
            <span className="text-lg mr-2">✦</span> Create
          </Button>
        </div>
      </div>
    </section>
  );
}
