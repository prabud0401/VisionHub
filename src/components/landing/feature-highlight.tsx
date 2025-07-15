
'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4 flex justify-center">
        <Card className="w-full max-w-5xl lg:w-4/5 aspect-video rounded-2xl overflow-hidden relative shadow-2xl shadow-primary/20">
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
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/70 to-transparent" />
          
          {/* Text Content */}
          <div className="relative z-10 h-full flex flex-col justify-end items-center text-center p-8 md:p-12 text-foreground">
            <Badge variant="secondary" className="mb-4 text-sm animate-pulse">
              Coming Soon
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
              {description}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
