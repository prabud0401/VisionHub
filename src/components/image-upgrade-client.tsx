'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Download, Loader2, UploadCloud, Wand2, X, AspectRatio, Trash2 } from 'lucide-react';
import { removeImageBackground } from '@/ai/flows/remove-image-background';
import { upscaleImage } from '@/ai/flows/upscale-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function ImageUpgradeClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const executeAiFlow = async (flow: 'removeBg' | 'upscale') => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setResultImage(null);
    
    try {
      let result;
      if (flow === 'removeBg') {
        setLoadingMessage('Removing background...');
        result = await removeImageBackground({ photoDataUri: originalImage });
        setResultImage(result.modifiedPhotoDataUri);
      } else {
        setLoadingMessage('Upscaling image...');
        result = await upscaleImage({ photoDataUri: originalImage, aspectRatio });
        setResultImage(result.upscaledPhotoDataUri);
      }
      toast({
        title: 'Image Processed!',
        description: 'You can now download the result.',
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }


  const handleReset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {!originalImage && (
          <div
            className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent hover:border-accent-foreground/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Click to upload an image</p>
            <p className="text-muted-foreground">PNG, JPG, or WEBP supported</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
          </div>
        )}
        
        {originalImage && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="text-center">
                <h3 className="font-headline text-xl mb-4">Original</h3>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                  <Image src={originalImage} alt="Original" fill className="object-contain" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-headline text-xl mb-4">Result</h3>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2032%2032%22%20width%3d%2232%22%20height%3d%2232%22%20fill%3d%22none%22%3e%3cpath%20d%3d%22M0%200h16v16H0z%22%20fill%3d%22%23374151%22%2f%3e%3cpath%20d%3d%22M16%2016h16v16H16z%22%20fill%3d%22%23374151%22%2f%3e%3c%2fsvg%3e')] bg-repeat">
                  {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="mt-4 text-muted-foreground">{loadingMessage}</p>
                    </div>
                  )}
                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                  {resultImage && (
                    <Image src={resultImage} alt="Result" fill className="object-contain" />
                  )}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="remove-bg" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="remove-bg"><Trash2 className="mr-2 h-4 w-4" />Remove Background</TabsTrigger>
                <TabsTrigger value="upscale"><AspectRatio className="mr-2 h-4 w-4" />Upscale & Resize</TabsTrigger>
              </TabsList>
              <TabsContent value="remove-bg" className="pt-4 text-center">
                 <Button onClick={() => executeAiFlow('removeBg')} disabled={isLoading || !originalImage}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isLoading ? 'Processing...' : 'Remove Background'}
                  </Button>
              </TabsContent>
              <TabsContent value="upscale" className="pt-4 space-y-4 text-center">
                 <div className="flex justify-center items-center gap-4">
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                        <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select an aspect ratio" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="1:1">Square (1:1)</SelectItem>
                        <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                        <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                        <SelectItem value="4:3">Standard (4:3)</SelectItem>
                        <SelectItem value="3:2">Classic (3:2)</SelectItem>
                        </SelectContent>
                    </Select>
                     <Button onClick={() => executeAiFlow('upscale')} disabled={isLoading || !originalImage}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isLoading ? 'Processing...' : 'Upscale Image'}
                      </Button>
                 </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex flex-wrap justify-center gap-4 border-t pt-6">
              {resultImage && (
                <Button asChild variant="secondary">
                  <a href={resultImage} download="visionhub-edited.png">
                    <Download className="mr-2 h-4 w-4" />
                    Download Result
                  </a>
                </Button>
              )}
              <Button onClick={handleReset} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
