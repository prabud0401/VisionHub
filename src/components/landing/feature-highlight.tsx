
'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="relative z-10 container mx-auto px-4 text-center text-foreground">
        <Badge variant="secondary" className="mb-4 text-sm animate-pulse">
          Coming Soon
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
          {description}
        </p>
      </div>
    </section>
  );
}
