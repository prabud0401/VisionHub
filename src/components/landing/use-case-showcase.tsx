
'use client';

import { Briefcase, Brush, Clapperboard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const useCases = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'For Marketers & Businesses',
    items: [
      'Social Media Content',
      'Blog & Website Illustrations',
      'Advertising Creatives',
      'Product Mockups',
      'Engaging Presentations',
    ],
  },
  {
    icon: <Brush className="h-8 w-8 text-primary" />,
    title: 'For Artists & Designers',
    items: [
      'Concept Art & Inspiration',
      'Book & Album Covers',
      'Architectural Visualization',
      'UI/UX Mockups',
      'Fashion Design',
    ],
  },
  {
    icon: <Clapperboard className="h-8 w-8 text-primary" />,
    title: 'For Content Creators',
    items: [
      'Compelling YouTube Thumbnails',
      'Visuals for Storytelling',
      'Custom Emojis & Avatars',
      'Podcast Cover Art',
      'Game Assets',
    ],
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'For Personal Use',
    items: [
      'Unique Phone Wallpapers',
      'Personalized Gifts',
      'Custom Social Avatars',
      'Creative Hobby Projects',
      'Just for Fun!',
    ],
  },
];

const UseCaseCard = ({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) => (
  <Card className="flex-shrink-0 w-80 h-full bg-card/80 backdrop-blur-sm border-border/50">
    <CardHeader className="flex flex-row items-center gap-4 pb-4">
      {icon}
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle className="h-4 w-4 mt-1 text-green-500/80 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export function UseCaseShowcase() {
  return (
    <section className="py-20 lg:py-24 bg-background/50 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Create Anything You Can Imagine
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          From professional marketing assets to personal creative projects, the possibilities are limitless.
        </p>
      </div>

      <div className="mt-12 relative w-full flex overflow-x-hidden">
        <div className="flex animate-marquee-slow py-4 w-max">
            {[...useCases, ...useCases].map((useCase, index) => (
            <div key={`${useCase.title}-${index}`} className="mx-4">
                <UseCaseCard {...useCase} />
            </div>
            ))}
        </div>
         <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />
      </div>
    </section>
  );
}
