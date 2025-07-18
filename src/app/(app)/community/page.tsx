
'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Loader2, X, Maximize, Bot, Tags, Briefcase, Crop, Check, CheckCircle, LayoutGrid, Rows, Columns, ArrowLeft, ArrowRight, Download, Share2, Link as LinkIcon, Twitter, Facebook, Mail } from 'lucide-react';
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
import { AdSlot } from '@/lib/ads-config';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


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

const SocialSharePopover = ({ item }: { item: CommunityImage }) => {
    const { toast } = useToast();
    const promptText = `Check out this AI creation from VisionHub: "${item.prompt}"`;

    const copyLink = () => {
        navigator.clipboard.writeText(item.url);
        toast({ title: 'Link Copied!', description: 'The image URL is now in your clipboard.' });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={copyLink}><LinkIcon /></Button>
                    <Button asChild variant="ghost" size="icon">
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(promptText)}&url=${encodeURIComponent(item.url)}`} target="_blank" rel="noopener noreferrer"><Twitter /></a>
                    </Button>
                     <Button asChild variant="ghost" size="icon">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.url)}`} target="_blank" rel="noopener noreferrer"><Facebook /></a>
                    </Button>
                    <Button asChild variant="ghost" size="icon">
                        <a href={`mailto:?subject=AI Art from VisionHub&body=${encodeURIComponent(promptText)}%0A%0A${encodeURIComponent(item.url)}`}><Mail /></a>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default function CommunityPage() {
  const [images, setImages] = useState<CommunityImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
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

    // Intersperse ads
    if (user?.showAds) {
        const withAds: any[] = [];
        for (let i = 0; i < result.length; i++) {
            withAds.push(result[i]);
            if ((i + 1) % 9 === 0) { // Insert an ad every 9 images
                withAds.push({ type: 'ad', id: `ad-${i}` });
            }
        }
        return withAds;
    }

    return result;
  }, [images, filters, sortOrder, user?.showAds]);


  const gridClasses = {
    small: 'columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6',
    medium: 'columns-2 md:columns-3 lg:columns-4',
    large: 'columns-1 sm:columns-2 lg:columns-3',
  };
  
  const handleClearFilters = () => {
    setFilters({ aspectRatio: 'all', useCase: 'all', tone: 'all' });
  };
  
  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
       toast({ variant: 'destructive', title: 'Download Failed', description: 'Could not download the image.' });
    }
  }
  
  const handleNextImage = () => {
      if (selectedImageIndex === null) return;
      const realImages = filteredAndSortedImages.filter(item => item.type !== 'ad');
      const currentFilteredIndex = realImages.findIndex(img => img.id === selectedImage?.id);
      const nextIndex = (currentFilteredIndex + 1) % realImages.length;
      const nextImageId = realImages[nextIndex].id;
      const nextMasterIndex = filteredAndSortedImages.findIndex(img => img.id === nextImageId);
      setSelectedImageIndex(nextMasterIndex);
  }
  
  const handlePrevImage = () => {
       if (selectedImageIndex === null) return;
      const realImages = filteredAndSortedImages.filter(item => item.type !== 'ad');
      const currentFilteredIndex = realImages.findIndex(img => img.id === selectedImage?.id);
      const prevIndex = (currentFilteredIndex - 1 + realImages.length) % realImages.length;
      const prevImageId = realImages[prevIndex].id;
      const prevMasterIndex = filteredAndSortedImages.findIndex(img => img.id === prevImageId);
      setSelectedImageIndex(prevMasterIndex);
  }

  const selectedImage = selectedImageIndex !== null ? filteredAndSortedImages[selectedImageIndex] : null;


  return (
    <>
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text">
          Community Showcase
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
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
          {filteredAndSortedImages.map((image, index) =>
            image.type === 'ad' ? (
                <div key={image.id} className="break-inside-avoid">
                    <AdSlot slotId="community-gallery-ad" showAds={!!user?.showAds} />
                </div>
            ) : (
                <Card 
                  key={image.id} 
                  className="overflow-hidden break-inside-avoid cursor-pointer group relative"
                  onClick={() => setSelectedImageIndex(index)}
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
            )
          )}
        </div>
      )}
    </div>

    <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-2">
            {selectedImage && (
                <>
                <div className="flex-grow relative">
                    <Image src={selectedImage.url} alt={selectedImage.prompt} fill className="object-contain rounded-md"/>
                </div>
                 <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10">
                    <Button variant="outline" size="icon" onClick={handlePrevImage}><ArrowLeft className="h-4 w-4" /></Button>
                 </div>
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
                    <Button variant="outline" size="icon" onClick={handleNextImage}><ArrowRight className="h-4 w-4" /></Button>
                 </div>
                 <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm p-4 rounded-b-md">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                             <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedImage.user?.photoURL} />
                                <AvatarFallback className="text-xs">{selectedImage.user?.displayName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                               <p className="text-sm font-medium leading-tight">{selectedImage.user?.displayName}</p>
                               <p className="text-xs text-muted-foreground leading-tight">@{selectedImage.user?.username}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <SocialSharePopover item={selectedImage} />
                            <Button variant="secondary" size="sm" onClick={() => handleDownload(selectedImage.url, `visionhub_art_${selectedImage.id}`)}>
                                <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                        </div>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                        &ldquo;{selectedImage.prompt}&rdquo;
                     </p>
                </div>
                </>
            )}
        </DialogContent>
    </Dialog>

    </>
  );
}
