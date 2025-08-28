
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import type { GeneratedImage, GeneratedVideo } from '@/lib/types';
import { PromptGroupCard } from './prompt-group-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download, Loader2, Trash2, Wand2, ArrowLeft, ArrowRight, Grid, Grid3x3, Square, Eye, Share2, CheckCircle, Info, PlusCircle, Link as LinkIcon, Twitter, Facebook, Mail, Users } from 'lucide-react';
import { getFirestore, collection, query, where, writeBatch, doc, onSnapshot, Unsubscribe, getDocs } from 'firebase/firestore';
import { getFirebaseApp } from '@/lib/firebase-config';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLocalStorage } from '@/hooks/use-local-storage';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { shareImageToCommunity } from '@/services/image-service';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle } from './ui/alert';
import Link from 'next/link';
import { AdSlot } from '@/lib/ads-config';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';


interface MediaItem extends GeneratedImage {
    type: 'image';
    isShared?: boolean;
}

interface VideoItem extends GeneratedVideo {
    type: 'video';
}

type GalleryItem = MediaItem | VideoItem;


interface PromptGroup {
  promptId: string;
  prompt: string;
  items: GalleryItem[];
  createdAt: string;
  coverImage: string;
  type: 'image' | 'video';
}

const ITEMS_PER_PAGE = 12;

const SocialSharePopover = ({ item }: { item: GalleryItem }) => {
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

export function GalleryClient() {
  const [allPromptGroups, setAllPromptGroups] = useState<PromptGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<PromptGroup | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<PromptGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'medium' | 'small' | 'large'>('medium');
  const [currentPage, setCurrentPage] = useState(1);
  const [imageCount, setImageCount] = useState(0);

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [, setImageForUpgrade] = useLocalStorage<string | null>('imageForUpgrade', null);


  useEffect(() => {
    let isMounted = true;
    let imageUnsubscribe: Unsubscribe = () => {};
    let videoUnsubscribe: Unsubscribe = () => {};

    const setupListeners = async () => {
        const firebaseApp = await getFirebaseApp();
        if (!user || !firebaseApp || !isMounted) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);

        const db = getFirestore(firebaseApp);
        let allImages: GeneratedImage[] = [];
        let allVideos: GeneratedVideo[] = [];
        let sharedImageIds = new Set<string>();
        
        const imageColl = collection(db, 'images');
        const imageQuery = query(imageColl, where('userId', '==', user.uid));
        
        const processAndSetGroups = () => {
            if (!isMounted) return;

            const imageItems: MediaItem[] = allImages.map(img => ({...img, type: 'image', isShared: sharedImageIds.has(img.id)}));
            const videoItems: VideoItem[] = allVideos.map(vid => ({...vid, type: 'video'}));
            const allItems = [...imageItems, ...videoItems];

            const groups: { [key: string]: PromptGroup } = {};

            allItems.forEach(item => {
                const promptId = item.promptId || item.prompt;
                if (!groups[promptId]) {
                groups[promptId] = {
                    promptId: promptId,
                    prompt: item.prompt,
                    items: [],
                    createdAt: item.createdAt,
                    coverImage: item.type === 'image' ? item.url : 'https://placehold.co/400x400.png', // Placeholder for video cover
                    type: item.type,
                };
                }
                groups[promptId].items.push(item);
                if(item.type === 'image') {
                groups[promptId].coverImage = item.url;
                }
                if (new Date(item.createdAt) > new Date(groups[promptId].createdAt)) {
                groups[promptId].createdAt = item.createdAt;
                }
            });
            
            setAllPromptGroups(Object.values(groups));
            setIsLoading(false);
        }
        
        try {
            const sharedImagesQuery = query(collection(db, 'community'), where('userId', '==', user.uid));
            const sharedSnapshot = await getDocs(sharedImagesQuery);
            sharedImageIds = new Set(sharedSnapshot.docs.map(doc => doc.data().originalImageId));

            const videoQuery = query(collection(db, 'videos'), where('userId', '==', user.uid));

            imageUnsubscribe = onSnapshot(imageQuery, (snapshot) => {
                allImages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedImage));
                if (isMounted) setImageCount(snapshot.size); // Update count on snapshot change
                processAndSetGroups();
            }, (error) => console.error("Error with image snapshot listener: ", error));

            videoUnsubscribe = onSnapshot(videoQuery, (snapshot) => {
                allVideos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedVideo));
                processAndSetGroups();
            }, (error) => console.error("Error with video snapshot listener: ", error));

        } catch (error) {
            console.error("Error setting up snapshot listeners: ", error);
            setIsLoading(false);
        }
    };
    
    setupListeners();
    
    return () => {
        isMounted = false;
        imageUnsubscribe();
        videoUnsubscribe();
    };
  }, [user]);

  const sortedGroups = useMemo(() => {
    return [...allPromptGroups].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [allPromptGroups, sortOrder]);


  const totalPages = Math.ceil(sortedGroups.length / ITEMS_PER_PAGE);
  const paginatedGroups = sortedGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const itemsWithAds = useMemo(() => {
    if (!user?.showAds) return paginatedGroups;

    const itemsWithAds: any[] = [];
    for (let i = 0; i < paginatedGroups.length; i++) {
        itemsWithAds.push(paginatedGroups[i]);
        if ((i + 1) % 6 === 0) {
            itemsWithAds.push({ type: 'ad', promptId: `ad-${i}` });
        }
    }
    return itemsWithAds;
  }, [paginatedGroups, user?.showAds]);


  const handleUpgradeImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImageForUpgrade(dataUri);
        router.push('/background-remover');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to process image for upgrade:", error);
    }
  };


  const handleSelectGroup = (group: PromptGroup) => {
    setSelectedGroup(group);
    setSelectedMediaIndex(0);
  };

  const confirmDeleteGroup = (group: PromptGroup) => {
    setGroupToDelete(group);
  };

  const handleShareImage = async (image: MediaItem) => {
    if (!user) return;
    try {
        await shareImageToCommunity(image, user.uid);
        toast({
            title: "Image Shared!",
            description: "Your creation is now live in the Community Showcase.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Sharing Failed",
            description: "Could not share the image. Please try again.",
        });
        console.error("Error sharing image:", error);
    }
  };

  const handleDownload = async (item: GalleryItem) => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = item.type === 'image' ? 'png' : 'mp4';
      link.download = `visionhub-ai-${item.id}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
       toast({ variant: 'destructive', title: 'Download Failed', description: 'Could not download the file.' });
    }
  };


  const handleDeleteGroup = async () => {
    const firebaseApp = await getFirebaseApp();
    if (!groupToDelete || !firebaseApp) return;
    
    try {
        const db = getFirestore(firebaseApp);
        const batch = writeBatch(db);

        groupToDelete.items.forEach(item => {
          const collectionName = item.type === 'image' ? 'images' : 'videos';
          const docRef = doc(db, collectionName, item.id);
          batch.delete(docRef);
        });

        await batch.commit();

    } catch (error) {
        console.error("Error deleting item group: ", error);
    } finally {
      setGroupToDelete(null);
    }
  };
  
  const storageLimit = user?.storageLimit ?? 50;
  const isLimitReached = storageLimit !== -1 && imageCount >= storageLimit;
  
  const selectedMedia = selectedGroup && selectedMediaIndex !== null ? selectedGroup.items[selectedMediaIndex] : null;
  
  const handleNextMedia = () => {
      if (selectedGroup && selectedMediaIndex !== null) {
          setSelectedMediaIndex((prevIndex) => (prevIndex! + 1) % selectedGroup.items.length);
      }
  }

  const handlePrevMedia = () => {
      if (selectedGroup && selectedMediaIndex !== null) {
          setSelectedMediaIndex((prevIndex) => (prevIndex! - 1 + selectedGroup.items.length) % selectedGroup.items.length);
      }
  }


  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoading && allPromptGroups.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Your gallery is empty</h2>
        <p className="text-muted-foreground mt-2">Start creating images or videos on the dashboard to see them here.</p>
        <Button asChild className="mt-4"><Link href="/dashboard">Start Creating</Link></Button>
      </div>
    );
  }

  const gridClasses = {
    small: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    medium: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    large: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <>
      <div className="mb-8 p-4 bg-card rounded-lg border flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
             <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="text-sm font-medium">
            Gallery Usage: {imageCount} / {storageLimit === -1 ? 'Unlimited' : storageLimit} images
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium">View:</span>
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'small' | 'medium' | 'large')} variant="outline">
                <ToggleGroupItem value="small" aria-label="Small grid"><Grid3x3 className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="medium" aria-label="Medium grid"><Grid className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="large" aria-label="Large grid"><Square className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
        </div>
      </div>
      
       {isLimitReached && (
        <Alert variant="destructive" className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle className="font-semibold">Gallery Limit Reached</AlertTitle>
            <div className="flex justify-between items-center">
              <p>You have reached your gallery storage limit. To save new images, you must either delete old ones or upgrade your plan for unlimited storage.</p>
              <Button asChild>
                <Link href="/pricing">
                  <PlusCircle className="mr-2 h-4 w-4" /> Upgrade Plan
                </Link>
              </Button>
            </div>
        </Alert>
      )}


      <div className={cn("grid gap-4", gridClasses[viewMode])}>
        {itemsWithAds.map((item, index) =>
          (item as any).type === 'ad' ? (
            <div key={`ad-${index}`} className="aspect-square">
               <AdSlot slotId="user-gallery-ad" showAds={!!user?.showAds} />
            </div>
          ) : (
            <PromptGroupCard
              key={(item as PromptGroup).promptId}
              group={item as PromptGroup}
              onView={() => handleSelectGroup(item as PromptGroup)}
              onDelete={() => confirmDeleteGroup(item as PromptGroup)}
              onUpgrade={(item as PromptGroup).type === 'image' ? () => handleUpgradeImage((item as PromptGroup).coverImage) : undefined}
            />
          )
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>
             <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
      )}

      <Dialog open={!!selectedGroup} onOpenChange={(isOpen) => !isOpen && setSelectedGroup(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-2">
          {selectedGroup && selectedMedia && (
            <>
              <div className="flex-grow relative">
                {selectedMedia.type === 'image' ? (
                  <Image src={selectedMedia.url} alt="Selected image" fill className="object-contain rounded-md" />
                ) : (
                  <video src={selectedMedia.url} controls autoPlay className="w-full h-full object-contain rounded-md bg-black" />
                )}
              </div>
              {selectedGroup.items.length > 1 && (
                <>
                <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10">
                    <Button variant="outline" size="icon" onClick={handlePrevMedia}><ArrowLeft className="h-4 w-4" /></Button>
                </div>
                <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
                    <Button variant="outline" size="icon" onClick={handleNextMedia}><ArrowRight className="h-4 w-4" /></Button>
                </div>
                </>
              )}
              <div className="flex-shrink-0 bg-background/80 backdrop-blur-sm p-4 rounded-b-md">
                 <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground truncate" title={selectedMedia.prompt}>
                           &ldquo;{selectedMedia.prompt}&rdquo;
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <SocialSharePopover item={selectedMedia} />
                        <Button variant="secondary" size="sm" onClick={() => handleDownload(selectedMedia)}>
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                        {selectedMedia.type === 'image' && (
                            (selectedMedia as MediaItem).isShared ? (
                                <Button variant="outline" size="sm" disabled>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    Shared
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => handleShareImage(selectedMedia as MediaItem)}>
                                    <Users className="mr-2 h-4 w-4" />
                                    Share to Community
                                </Button>
                            )
                        )}
                    </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!groupToDelete} onOpenChange={(isOpen) => !isOpen && setGroupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all {groupToDelete?.items.length} items associated with this prompt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
