'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useAuth } from '@/context/auth-context';
import type { GeneratedImage } from '@/lib/types';
import { ImageCard } from './image-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download, Loader2, Trash2 } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
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

export function GalleryClient() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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
        setImages(fetchedImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error("Error fetching images: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchImages();
  }, [user]);

  const handleSelectImage = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const confirmDeleteImage = (id: string) => {
    setImageToDelete(id);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete || !firebaseApp) return;
    
    try {
        const db = getFirestore(firebaseApp);
        await deleteDoc(doc(db, "images", imageToDelete));
        setImages(images.filter((img) => img.id !== imageToDelete));
        // TODO: Also delete from Firebase Storage
    } catch (error) {
        console.error("Error deleting image: ", error);
    } finally {
      setImageToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
            onDelete={() => confirmDeleteImage(image.id)}
          />
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>Image Details</DialogTitle>
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
                   <div>
                    <h3 className="font-semibold mb-2">Model</h3>
                    <p className="text-sm text-muted-foreground">{selectedImage.model}</p>
                  </div>
                  <Button asChild className="mt-auto" variant="accent">
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
      
      <AlertDialog open={!!imageToDelete} onOpenChange={(isOpen) => !isOpen && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your image
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteImage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
