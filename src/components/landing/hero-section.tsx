'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const { setAuthModalOpen } = useAuth();
  
  const handleCreate = () => {
    setAuthModalOpen(true);
  };

  return (
    <section 
      id="home" 
      className="relative h-screen w-full flex items-center justify-center text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://mir-s3-cdn-cf.behance.net/project_modules/fs/bb82b776060455.5c5e341a7bbaa.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Unleash Your Creativity with AI</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80 mb-8">
          Turn your imagination into stunning visuals. VisionHub integrates multiple AI models to give you the ultimate creative power.
        </p>
        <div className="max-w-2xl mx-auto flex items-center gap-2 bg-background/50 p-2 rounded-lg border border-border">
          <Input 
            type="text" 
            placeholder="A majestic lion with a crown of stars, digital painting"
            className="flex-grow bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-muted-foreground"
            onFocus={handleCreate}
          />
          <Button variant="accent" size="lg" onClick={handleCreate}>
            <span className="hidden sm:inline">Generate</span>
            <ArrowRight className="sm:ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
