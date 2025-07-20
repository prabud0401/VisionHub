
'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: string[]) => {
  if (!array || array.length === 0) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const MarqueeRow = ({ images, reverse = false }: { images: string[], reverse?: boolean }) => {
  if (images.length === 0) return null; // Don't render if there are no images

  return (
    <div className="flex w-max items-center">
      <div className={cn("flex w-max items-center", reverse ? 'animate-marquee-reverse' : 'animate-marquee')}>
        {images.map((imgSrc, i) => (
          <div key={`marquee-${i}`} className="w-64 h-64 p-2">
             <Image
              src={imgSrc}
              alt="AI generated art preview"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
            />
          </div>
        ))}
      </div>
      <div className={cn("flex w-max items-center", reverse ? 'animate-marquee-reverse' : 'animate-marquee')}>
        {images.map((imgSrc, i) => (
          <div key={`marquee-clone-${i}`} className="w-64 h-64 p-2">
             <Image
              src={imgSrc}
              alt="AI generated art preview"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};


export default function GalleryPreview({ imagePaths }: { imagePaths: string[] }) {
  // useMemo will prevent re-shuffling on every render, only when imagePaths change.
  const shuffledRow1 = useMemo(() => shuffleArray(imagePaths), [imagePaths]);
  const shuffledRow2 = useMemo(() => shuffleArray(imagePaths), [imagePaths]);
  const shuffledRow3 = useMemo(() => shuffleArray(imagePaths), [imagePaths]);
  
  if (imagePaths.length === 0) {
    return null; // Don't render anything if no images were found
  }

  return (
    <section id="gallery" className="py-20 bg-transparent overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter">Creations From Our Community</h2>
        <p className="mt-4 text-lg text-muted-foreground">Get inspired by what others are creating.</p>
      </div>
      <div className="space-y-4">
        <MarqueeRow images={shuffledRow1} />
        <MarqueeRow images={shuffledRow2} reverse />
        <MarqueeRow images={shuffledRow3} />
      </div>
    </section>
  );
}
