'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useAuth } from '@/context/auth-context';
import type { GeneratedImage } from '@/lib/types';
import { PromptGroupCard } from './prompt-group-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download, Loader2, Trash2, Wand2 } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import firebaseApp from '@/lib/firebase-config';
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

interface PromptGroup {
  promptId: string;
  prompt: string;
  images: GeneratedImage[];
  createdAt: string;
  coverImage: string;
}

export function GalleryClient() {
  const [promptGroups, setPromptGroups] = useState<PromptGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<PromptGroup | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<PromptGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [, setImageForUpgrade] = useLocalStorage<string | null>('imageForUpgrade', null);


  const handleUpgradeImage = async (imageUrl: string) => {
    try {
      // Fetch the image and convert it to a data URI
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

  useEffect(() => {
    async function fetchImages() {
      if (!user || !firebaseApp) {
        setIsLoading(false);
        return;
      }
      try {
        const db = getFirestore(firebaseApp);
        const q = query(collection(db, 'images'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
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
          // Update created at to the latest image in group for sorting
          if (new Date(image.createdAt) > new Date(groups[promptId].createdAt)) {
            groups[promptId].createdAt = image.createdAt;
            groups[promptId].coverImage = image.url;
          }
        });
        
        const sortedGroups = Object.values(groups).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPromptGroups(sortedGroups);

      } catch (error) {
        console.error("Error fetching images: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchImages();
  }, [user]);

  const handleSelectGroup = (group: PromptGroup) => {
    setSelectedGroup(group);
  };

  const confirmDeleteGroup = (group: PromptGroup) => {
    setGroupToDelete(group);
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete || !firebaseApp) return;
    
    try {
        const db = getFirestore(firebaseApp);
        const batch = writeBatch(db);

        groupToDelete.images.forEach(image => {
          const docRef = doc(db, "images", image.id);
          batch.delete(docRef);
        });

        await batch.commit();

        setPromptGroups(promptGroups.filter((g) => g.promptId !== groupToDelete.promptId));
        // TODO: Also delete from Firebase Storage
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

  if (promptGroups.length === 0) {
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
        {promptGroups.map((group) => (
          <PromptGroupCard
            key={group.promptId}
            group={group}
            onView={() => handleSelectGroup(group)}
            onDelete={() => confirmDeleteGroup(group)}
            onUpgrade={() => handleUpgradeImage(group.coverImage)}
          />
        ))}
      </div>

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
