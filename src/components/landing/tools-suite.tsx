
'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: 'Text-to-Image Generation',
    description: 'Transform your words into breathtaking visuals.',
    image: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/9903a45e-a612-4c25-829d-128a1a364132.jpeg',
    dataAiHint: 'abstract art colorful',
    link: '/services'
  },
  {
    title: 'Image Upgrade Suite',
    description: 'Upscale, outpaint, and remove backgrounds with ease.',
    image: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/a45a6e51-c0e4-411a-a035-7c3984e79782.jpeg',
    dataAiHint: 'photo editing tools',
    link: '/services'
  },
  {
    title: 'Prompt Enhancer',
    description: 'Let our AI perfect your prompts for superior results.',
    image: 'https://cdn.web.imagine.art/imagine-frontend/assets/images/6a147e40-887c-4a37-b5b1-d5867a57a922.jpeg',
    dataAiHint: 'glowing brain idea',
    link: '/services'
  }
];

export default function ToolsSuite() {
  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">An Integrated Suite of Creative Tools</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Everything you need from initial concept to final polish, all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link href={tool.link} key={tool.title} className="group">
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-primary hover:shadow-primary/20 hover:-translate-y-2">
                <CardHeader>
                  <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                      src={tool.image}
                      alt={tool.title}
                      data-ai-hint={tool.dataAiHint}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow p-6">
                  <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                  <CardDescription className="flex-grow">{tool.description}</CardDescription>
                  <div className="mt-4 flex items-center text-primary font-semibold">
                    Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
