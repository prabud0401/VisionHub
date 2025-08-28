'use client';

import { memo, useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Download, Eye, Share2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedImage } from '@/lib/types';
import Image from 'next/image';
import { useAppStore } from '@/stores/app-store';

interface DashboardResultsProps {
  generatedImages: GeneratedImage[] | null;
  isGenerating: boolean;
  error: string | null;
}

// Memoized loading animation
const GenerationLoader = memo(() => (
  <div className="flex flex-col items-center gap-4 text-muted-foreground py-16">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <div className="absolute inset-2 border-2 border-primary/10 border-b-primary/30 rounded-full animate-spin animate-reverse" />
    </div>
    <div className="text-center">
      <p className="font-semibold text-lg">Creating magic...</p>
      <p className="text-sm">This may take a few moments</p>
    </div>
  </div>
));

GenerationLoader.displayName = 'GenerationLoader';

// Memoized image card component
const ImageCard = memo(({ 
  image, 
  index, 
  onView, 
  onDownload 
}: { 
  image: GeneratedImage;
  index: number;
  onView: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloadLoading(true);
    try {
      await onDownload(image);
    } finally {
      setDownloadLoading(false);
    }
  }, [image, onDownload]);

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="relative aspect-square">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <Image
          src={image.url}
          alt={`Generated image ${index + 1}: ${image.prompt}`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsLoading(false)}
          quality={85}
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onView(image)}
              className="backdrop-blur-sm bg-white/90 text-black hover:bg-white"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownload}
              disabled={downloadLoading}
              className="backdrop-blur-sm bg-white/90 text-black hover:bg-white"
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1" />
              )}
              Download
            </Button>
          </div>
        </div>

        {/* Model badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-medium bg-primary/90 text-primary-foreground rounded-full backdrop-blur-sm">
            {image.model}
          </span>
        </div>

        {/* Aspect ratio badge */}
        {image.aspectRatio && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full backdrop-blur-sm">
              {image.aspectRatio}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {image.prompt}
        </p>
        {image.tones && image.tones.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {image.tones.map((tone) => (
              <span
                key={tone}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
              >
                {tone}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ImageCard.displayName = 'ImageCard';

// Main results component
export function DashboardResults({ 
  generatedImages, 
  isGenerating, 
  error 
}: DashboardResultsProps) {
  const { selectedImage, setSelectedImage } = useAppStore();
  const { toast } = useToast();

  const handleViewImage = useCallback((image: GeneratedImage) => {
    setSelectedImage(image.url);
  }, [setSelectedImage]);

  const handleDownloadImage = useCallback(async (image: GeneratedImage) => {
    try {
      // Use fetch with cors mode to handle potential cross-origin issues
      const response = await fetch(image.url, { mode: 'cors' });
      if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `visionhub-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download Started',
        description: 'Your image is being downloaded.',
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not download the image. This might be a CORS issue. Please ensure your storage bucket is configured for cross-origin access.',
      });
    }
  }, [toast]);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, [setSelectedImage]);

  return (
    <>
      <Card className="h-full sticky top-24">
        <CardHeader>
          <CardTitle className="font-headline">Results</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {/* Loading State */}
          {isGenerating && !generatedImages && <GenerationLoader />}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-16">
              <Alert variant="destructive" className="max-w-md">
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Results Grid */}
          {generatedImages && generatedImages.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Generated {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    // Download all images as zip would be nice here
                    toast({
                      title: 'Feature Coming Soon',
                      description: 'Bulk download will be available in a future update.',
                    });
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((image, index) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    index={index}
                    onView={handleViewImage}
                    onDownload={handleDownloadImage}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isGenerating && !generatedImages && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No images generated yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Fill out the form on the left and click "Generate Images" to see your creations here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-2">
          {selectedImage && (
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Generated image preview"
                width={1024}
                height={1024}
                className="object-contain w-full h-full max-h-[80vh]"
                quality={95}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 
