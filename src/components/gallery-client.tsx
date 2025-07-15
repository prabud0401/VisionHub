
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import type { GeneratedImage } from '@/lib/types';
import { PromptGroupCard } from './prompt-group-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download, Loader2, Trash2, Wand2, ArrowLeft, ArrowRight, Grid, Grid3x3, Square } from 'lucide-react';
import { getFirestore, collection, query, where, writeBatch, doc, onSnapshot } from 'firebase/firestore';
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

interface PromptGroup {
  promptId: string;
  prompt: string;
  images: GeneratedImage[];
  createdAt: string;
  coverImage: string;
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
    let unsubscribe = () => {};

    const setupListener = async () => {
      const firebaseApp = await getFirebaseApp();
      if (!user || !firebaseApp) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const db = getFirestore(firebaseApp);
        const q = query(collection(db, 'images'), where('userId', '==', user.uid));
        
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedImages: GeneratedImage[] = [];
          querySnapshot.forEach((doc) => {
            fetchedImages.push({ id: doc.id, ...doc.data() } as GeneratedImage);
          });
          
          const groups: { [key: string]: PromptGroup } = {};
          fetchedImages.forEach(image => {
            const promptId = image.promptId || image.prompt; // Fallback for older images
            if (!groups[promptId]) {
              groups[promptId] = {
                promptId: promptId,
                prompt: image.prompt,
                images: [],
                createdAt: image.createdAt,
                coverImage: image.url,
              };
            }
            groups[promptId].images.push(image);
            if (new Date(image.createdAt) > new Date(groups[promptId].createdAt)) {
              groups[promptId].createdAt = image.createdAt;
              groups[promptId].coverImage = image.url;
            }
          });
          
          setAllPromptGroups(Object.values(groups));
          setIsLoading(false);
        }, (error) => {
          console.error("Error with snapshot listener: ", error);
          setIsLoading(false);
        });

      } catch (error) {
        console.error("Error setting up snapshot listener: ", error);
        setIsLoading(false);
      }
    };
    
    if (user) {
      setupListener();
    } else {
      setIsLoading(false);
    }
    
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
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

        groupToDelete.images.forEach(image => {
          const docRef = doc(db, "images", image.id);
          batch.delete(docRef);
        });

        await batch.commit();

        // No need to update local state here, onSnapshot will do it automatically
    } catch (error) {
        console.error("Error deleting image group: ", error);
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
        <p className="text-muted-foreground mt-2">Start creating images on the dashboard to see them here.</p>
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
            onUpgrade={() => handleUpgradeImage(group.coverImage)}
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
                  {selectedGroup.images.length} images generated on {format(new Date(selectedGroup.createdAt), 'PPP')}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2">
                {selectedGroup.images.map(image => (
                    <div key={image.id} className="flex flex-col gap-2">
                        <div className="relative aspect-square">
                            <Image
                                src={image.url}
                                alt={image.prompt}
                                fill
                                className="rounded-lg object-cover border"
                            />
                             <div className="absolute bottom-1 right-1 bg-background/70 text-foreground text-xs px-1.5 py-0.5 rounded">
                                {image.model}
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-2">
                           <Button asChild variant="secondary" size="sm">
                              <a href={image.url} download={`visionhub-ai-${image.id}.png`}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                              </a>
                           </Button>
                           <Button variant="outline" size="sm" onClick={() => handleUpgradeImage(image.url)}>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Upgrade
                           </Button>
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
              This action cannot be undone. This will permanently delete all {groupToDelete?.images.length} images
              associated with this prompt.
            </AlexDialogDescription>
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
