'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import type { GeneratedImage, GeneratedVideo } from '@/lib/types';
import { PromptGroupCard } from './prompt-group-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download, Loader2, Trash2, Wand2, ArrowLeft, ArrowRight, Grid, Grid3x3, Square, Eye } from 'lucide-react';
import { getFirestore, collection, query, where, writeBatch, doc, onSnapshot, Unsubscribe } from 'firebase/firestore';
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

interface MediaItem extends GeneratedImage {
    type: 'image';
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

export function GalleryClient() {
  const [allPromptGroups, setAllPromptGroups] = useState<PromptGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<PromptGroup | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<PromptGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'medium' | 'small' | 'large'>('medium');
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const router = useRouter();
  const [, setImageForUpgrade] = useLocalStorage<string | null>('imageForUpgrade', null);


  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }

    let imageUnsubscribe: Unsubscribe = () => {};
    let videoUnsubscribe: Unsubscribe = () => {};

    const setupListeners = async () => {
      const firebaseApp = await getFirebaseApp();
      if (!firebaseApp) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);

      const db = getFirestore(firebaseApp);
      let allImages: GeneratedImage[] = [];
      let allVideos: GeneratedVideo[] = [];

      const processAndSetGroups = () => {
        const imageItems: MediaItem[] = allImages.map(img => ({...img, type: 'image'}));
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
        const imageQuery = query(collection(db, 'images'), where('userId', '==', user.uid));
        const videoQuery = query(collection(db, 'videos'), where('userId', '==', user.uid));

        imageUnsubscribe = onSnapshot(imageQuery, (snapshot) => {
            allImages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedImage));
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
  };

  const confirmDeleteGroup = (group: PromptGroup) => {
    setGroupToDelete(group);
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-card rounded-lg border">
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
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium">View:</span>
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'small' | 'medium' | 'large')} variant="outline">
                <ToggleGroupItem value="small" aria-label="Small grid"><Grid3x3 className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="medium" aria-label="Medium grid"><Grid className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="large" aria-label="Large grid"><Square className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
        </div>
      </div>

      <div className={cn("grid gap-4", gridClasses[viewMode])}>
        {paginatedGroups.map((group) => (
          <PromptGroupCard
            key={group.promptId}
            group={group}
            onView={() => handleSelectGroup(group)}
            onDelete={() => confirmDeleteGroup(group)}
            onUpgrade={group.type === 'image' ? () => handleUpgradeImage(group.coverImage) : undefined}
          />
        ))}
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
        <DialogContent className="max-w-5xl">
          {selectedGroup && (
            <>
              <DialogHeader>
                <DialogTitle>"{selectedGroup.prompt}"</DialogTitle>
                <DialogDescription>
                  {selectedGroup.items.length} {selectedGroup.type}(s) generated on {format(new Date(selectedGroup.createdAt), 'PPP')}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2">
                {selectedGroup.items.map(item => (
                    <div key={item.id} className="flex flex-col gap-2">
                        <div className="relative aspect-square">
                           {item.type === 'image' ? (
                                <Image
                                    src={item.url}
                                    alt={item.prompt}
                                    fill
                                    className="rounded-lg object-cover border"
                                />
                           ) : (
                                <video
                                    src={item.url}
                                    controls
                                    className="rounded-lg object-cover border w-full h-full"
                                />
                           )}
                             <div className="absolute bottom-1 right-1 bg-background/70 text-foreground text-xs px-1.5 py-0.5 rounded">
                                {item.model}
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-2">
                           <Button asChild variant="secondary" size="sm">
                              <a href={item.url} download={`visionhub-ai-${item.id}.${item.type === 'image' ? 'png' : 'mp4'}`}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                              </a>
                           </Button>
                           {item.type === 'image' && (
                                <Button variant="outline" size="sm" onClick={() => handleUpgradeImage(item.url)}>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Upgrade
                                </Button>
                           )}
                        </div>
                    </div>
                ))}
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
              This action cannot be undone. This will permanently delete all {groupToDelete?.items.length} items
              associated with this prompt.
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
