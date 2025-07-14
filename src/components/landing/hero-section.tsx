'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';

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
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">VisionHub AI Image Generator</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80 mb-8">
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
