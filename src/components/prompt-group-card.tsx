'use client';

import Image from 'next/image';
import { Download, Eye, Images, Trash2, Wand2, Video } from 'lucide-react';
import type { GeneratedImage, GeneratedVideo } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type GalleryItem = (GeneratedImage & { type: 'image' }) | (GeneratedVideo & { type: 'video' });

interface PromptGroup {
  promptId: string;
  prompt: string;
  items: GalleryItem[];
  createdAt: string;
  coverImage: string;
  type: 'image' | 'video';
}

interface PromptGroupCardProps {
  group: PromptGroup;
  onView: () => void;
  onDelete: () => void;
  onUpgrade?: () => void;
}

export function PromptGroupCard({ group, onView, onDelete, onUpgrade }: PromptGroupCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };
  
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView();
  }

  const handleUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpgrade?.();
  }

  const Icon = group.type === 'image' ? Images : Video;

  return (
    <Card className="overflow-hidden group relative flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <CardContent className="p-0 flex-grow">
        <div 
            className="aspect-square relative"
            onClick={handleView}
            role="button"
            tabIndex={0}
            >
          {group.type === 'image' ? (
              <Image
                src={group.coverImage}
                alt={group.prompt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
          ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <Video className="w-16 h-16 text-muted-foreground" />
              </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
            <Button size="icon" variant="secondary" onClick={handleView} aria-label="View Item Group">
              <Eye className="h-5 w-5" />
            </Button>
             {onUpgrade && (
                <Button size="icon" variant="secondary" onClick={handleUpgrade} aria-label="Upgrade Image">
                    <Wand2 className="h-5 w-5" />
                </Button>
             )}
            <Button size="icon" variant="destructive" onClick={handleDelete} aria-label="Delete Item Group">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/70 text-foreground text-xs font-medium px-2 py-1 rounded-full">
            <Icon className="h-3 w-3" />
            <span>{group.items.length}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 bg-secondary/30">
        <p className="text-xs text-muted-foreground truncate" title={group.prompt}>
            {group.prompt}
        </p>
      </CardFooter>
    </Card>
  );
}
