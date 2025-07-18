
'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Loader2, X, Maximize, Bot, Tags, Briefcase, Crop, Check, CheckCircle, LayoutGrid, Rows, Columns } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getCommunityImages } from '@/services/image-service';
import type { GeneratedImage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CommunityImage extends GeneratedImage {
  user?: {
    displayName: string;
    photoURL?: string;
    username: string;
  }
}

const allUseCases = [
    "social-media-post", "blog-illustration", "concept-art", 
    "youtube-thumbnail", "advertisement-creative", "presentation-graphic", "personal-avatar"
];
const allTones = [
    "Cinematic", "Photorealistic", "Fantasy", "Anime", "Cyberpunk",
    "Vintage", "Minimalist", "Vibrant", "Surreal", "Impressionistic"
];
const allAspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:2"];


export default function CommunityPage() {
  const [images, setImages] = useState<CommunityImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<CommunityImage | null>(null);
  
  // Filtering and Sorting State
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'medium' | 'small' | 'large'>('medium');
  const [filters, setFilters] = useState({
      aspectRatio: 'all',
      useCase: 'all',
      tone: 'all',
  });

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

  const filteredAndSortedImages = useMemo(() => {
    let result = [...images];

    // Filtering
    result = result.filter(image => {
        const aspectRatioMatch = filters.aspectRatio === 'all' || image.aspectRatio === filters.aspectRatio;
        const useCaseMatch = filters.useCase === 'all' || image.useCase === filters.useCase;
        const toneMatch = filters.tone === 'all' || image.tones?.includes(filters.tone);
        return aspectRatioMatch && useCaseMatch && toneMatch;
    });

    // Sorting
    result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [images, filters, sortOrder]);


  const gridClasses = {
    small: 'columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6',
    medium: 'columns-2 md:columns-3 lg:columns-4',
    large: 'columns-1 sm:columns-2 lg:columns-3',
  };
  
  const handleClearFilters = () => {
    setFilters({ aspectRatio: 'all', useCase: 'all', tone: 'all' });
  };


  return (
    <>
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Community Showcase
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Get inspired by what others are creating with VisionHub AI.
        </p>
      </div>
      
      <Card className="mb-8 p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
                 <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Sort by: Newest</SelectItem>
                        <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={filters.aspectRatio} onValueChange={(v) => setFilters(f => ({...f, aspectRatio: v}))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Aspect Ratio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Aspect Ratios</SelectItem>
                        {allAspectRatios.map(ar => <SelectItem key={ar} value={ar}>{ar}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={filters.useCase} onValueChange={(v) => setFilters(f => ({...f, useCase: v}))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Use Case" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Use Cases</SelectItem>
                         {allUseCases.map(uc => <SelectItem key={uc} value={uc}>{uc.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filters.tone} onValueChange={(v) => setFilters(f => ({...f, tone: v}))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Tone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Tones</SelectItem>
                        {allTones.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button variant="ghost" onClick={handleClearFilters}>
                    <X className="mr-2 h-4 w-4" /> Clear
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">View:</span>
                <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'small' | 'medium' | 'large')} variant="outline">
                    <ToggleGroupItem value="large" aria-label="Large grid"><Columns className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="medium" aria-label="Medium grid"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="small" aria-label="Small grid"><Rows className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
      </Card>


      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredAndSortedImages.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No images match your filters.</h2>
          <p className="text-muted-foreground mt-2">Try clearing the filters to see more creations!</p>
        </div>
      ) : (
        <div className={cn("gap-4 space-y-4", gridClasses[viewMode])}>
          {filteredAndSortedImages.map(image => (
            <Card 
              key={image.id} 
              className="overflow-hidden break-inside-avoid cursor-pointer group relative"
              onClick={() => setSelectedImage(image)}
            >
              <CardContent className="p-0">
                <div className="aspect-auto">
                    <Image
                      src={image.url}
                      alt={image.prompt}
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Maximize className="w-12 h-12 text-white" />
                 </div>
              </CardContent>
              <CardFooter className="p-3 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
                 <div className="w-full">
                    <p className="text-sm text-white/90 truncate font-medium">&ldquo;{image.prompt}&rdquo;</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5 border-2 border-primary/50">
                        <AvatarImage src={image.user?.photoURL} />
                        <AvatarFallback className="text-xs">{image.user?.displayName?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-white/80">@{image.user?.username || 'anonymous'}</span>
                    </div>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>

    <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            {selectedImage && (
                <>
                <DialogHeader>
                    <DialogTitle className="truncate">"{selectedImage.prompt}"</DialogTitle>
                    <DialogDescription>
                        Created by @{selectedImage.user?.username || 'anonymous'} on {new Date(selectedImage.createdAt).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-3 gap-6 overflow-hidden">
                    <div className="md:col-span-2 relative min-h-[400px]">
                        <Image src={selectedImage.url} alt={selectedImage.prompt} fill className="object-contain rounded-md border"/>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-2">
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Bot /> AI Model</h3>
                            <Badge variant="secondary">{selectedImage.model}</Badge>
                        </div>
                         <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Crop /> Aspect Ratio</h3>
                            <Badge variant="outline">{selectedImage.aspectRatio}</Badge>
                        </div>
                        {selectedImage.useCase && selectedImage.useCase !== 'none' && (
                           <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2"><Briefcase /> Use Case</h3>
                                <Badge variant="outline">{selectedImage.useCase.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
                            </div>
                        )}
                         {selectedImage.tones && selectedImage.tones.length > 0 && (
                           <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2"><Tags /> Tones</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedImage.tones.map(tone => <Badge key={tone} variant="outline">{tone}</Badge>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </>
            )}
        </DialogContent>
    </Dialog>

    </>
  );
}
