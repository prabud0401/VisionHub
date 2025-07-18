
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { getCommunityImages } from '@/services/image-service';
import type { GeneratedImage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

interface CommunityImage extends GeneratedImage {
  user?: {
    displayName: string;
    photoURL?: string;
    username: string;
  }
}

// export const metadata: Metadata = {
//   title: 'Community Showcase | VisionHub AI',
//   description: 'Explore amazing creations from the VisionHub AI community.',
// };

export default function CommunityPage() {
  const [images, setImages] = useState<CommunityImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const communityImages = await getCommunityImages();
        setImages(communityImages);
      } catch (error) {
        console.error("Failed to fetch community images:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Community Showcase
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Get inspired by what others are creating with VisionHub AI.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">The gallery is quiet... for now.</h2>
          <p className="text-muted-foreground mt-2">Be the first to share your creations from your personal gallery!</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map(image => (
            <Card key={image.id} className="overflow-hidden break-inside-avoid">
              <CardContent className="p-0">
                <div className="aspect-auto relative">
                    <Image
                      src={image.url}
                      alt={image.prompt}
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover"
                    />
                </div>
              </CardContent>
              <CardFooter className="p-4 flex flex-col items-start">
                 <p className="text-sm text-muted-foreground mb-2">&ldquo;{image.prompt}&rdquo;</p>
                 <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={image.user?.photoURL} />
                      <AvatarFallback>{image.user?.displayName?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">@{image.user?.username || 'anonymous'}</span>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
