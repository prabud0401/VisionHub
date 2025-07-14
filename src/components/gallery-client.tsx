'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { GeneratedImage } from '@/lib/types';
import { ImageCard } from './image-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export function GalleryClient() {
  const [images, setImages] = useLocalStorage<GeneratedImage[]>('generated-images', []);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleSelectImage = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Your gallery is empty</h2>
        <p className="text-muted-foreground mt-2">Start creating images on the dashboard to see them here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onView={() => handleSelectImage(image)}
            onDelete={() => handleDeleteImage(image.id)}
          />
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline">Image Details</DialogTitle>
                <DialogDescription>
                  Created with {selectedImage.model} on {format(new Date(selectedImage.createdAt), 'PPP')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="relative aspect-square">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    fill
                    className="rounded-lg object-cover border"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Prompt</h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                      {selectedImage.prompt}
                    </p>
                  </div>
                  <Button asChild className="mt-auto">
                    <a href={selectedImage.url} download={`visionhub-ai-${selectedImage.id}.png`}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
