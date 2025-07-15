
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';

interface FeatureHighlightProps {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  isVideo?: boolean;
}

export default function FeatureHighlight({
  title,
  description,
  imageUrl,
  imageHint,
  isVideo = false,
}: FeatureHighlightProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 flex justify-center">
        {/*
          The structure is now mobile-first, stacking image and text.
          On large screens (lg:), we switch to a relative container
          with absolute positioning to create the overlay effect.
        */}
        <Card className="w-full max-w-4xl overflow-hidden shadow-2xl shadow-primary/20 bg-card border-none lg:relative lg:aspect-video lg:w-full">
          <CardHeader className="p-0">
            {/* Image container */}
            <div className="relative w-full aspect-video lg:absolute lg:inset-0">
              {isVideo ? (
                <video
                  src={imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={title}
                  data-ai-hint={imageHint}
                  fill
                  className="object-cover"
                />
              )}
               {/* Gradient overlay is only for large screens */}
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-background/90 via-background/70 to-transparent" />
            </div>
          </CardHeader>
          <CardContent>
            {/*
              Text Content container. On large screens, it becomes an overlay.
              On mobile, it's just normal card content.
            */}
            <div className="py-6 text-center lg:relative lg:z-10 lg:h-full lg:flex lg:flex-col lg:justify-end lg:items-center lg:p-12 lg:text-foreground">
              <Badge variant="secondary" className="mb-4 text-sm animate-pulse">
                Coming Soon
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground lg:text-foreground/80">
                {description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
