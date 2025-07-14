
import Image from 'next/image';
import { Metadata } from 'next';
import { Bot, Users, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | VisionHub AI',
  description: 'Learn about the mission, vision, and team behind VisionHub AI.',
};

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Pioneering the Future of Digital Creativity
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
            We believe in empowering creators with the most advanced AI tools, making professional-grade visual content accessible to everyone.
          </p>
        </div>

        <div className="relative w-full h-96 rounded-lg overflow-hidden mb-20 shadow-2xl shadow-primary/20">
          <Image
            src="https://placehold.co/1200x400"
            alt="AI generated art showcasing creativity"
            layout="fill"
            objectFit="cover"
            data-ai-hint="team collaboration"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to democratize creativity. We aim to break down the barriers of complex software and expensive hardware by providing a powerful, intuitive, and integrated suite of AI-powered tools. VisionHub AI is designed to be your creative co-pilot, helping you turn imagination into stunning reality, faster than ever before.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-xl">
                 <Image
                    src="https://placehold.co/400x400"
                    data-ai-hint="abstract goal target"
                    alt="Abstract representation of a target"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div className="flex justify-center md:order-2">
             <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-xl">
                 <Image
                    src="https://placehold.co/400x400"
                    data-ai-hint="diverse team technology"
                    alt="Abstract representation of a diverse team"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
          </div>
          <div className="md:order-1">
            <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are a passionate team of developers, designers, and AI researchers dedicated to pushing the boundaries of generative art. We come from diverse backgrounds but share a common goal: to build tools that inspire and enable the next generation of digital artists, marketers, and storytellers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
