
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const { user, setAuthModalOpen } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const handleCreate = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      if (prompt) {
        // Pass the prompt as a query parameter
        router.push(`/dashboard?prompt=${encodeURIComponent(prompt)}`);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-center text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/021/171/652/large_2x/colorful-abstract-wallpaper-modern-background-ai-generated-free-photo.jpg')"
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
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button variant="accent" size="lg" onClick={handleCreate}>
            <span className="hidden sm:inline">Start Creating</span>
            <ArrowRight className="sm:ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
