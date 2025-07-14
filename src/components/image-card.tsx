'use client';

import Image from 'next/image';
import { Download, Eye, Trash2 } from 'lucide-react';
import type { GeneratedImage } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ImageCardProps {
  image: GeneratedImage;
  onView: () => void;
  onDelete: () => void;
}

export function ImageCard({ image, onView, onDelete }: ImageCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };
  
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView();
  }

  return (
    <Card className="overflow-hidden group relative animate-in fade-in zoom-in-95 duration-500">
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <Image
            src={image.url}
            alt={image.prompt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div 
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4"
            onClick={handleView}
            >
            <Button size="icon" variant="secondary" onClick={handleView} aria-label="View Image">
              <Eye className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="secondary" asChild aria-label="Download Image">
              <a href={image.url} download={`visionhub-ai-${image.id}.png`} onClick={handleDownload}>
                <Download className="h-5 w-5" />
              </a>
            </Button>
            <Button size="icon" variant="destructive" onClick={handleDelete} aria-label="Delete Image">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
