'use client';

import { useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/stores/app-store';
import { generateImages } from '@/ai/flows/generate-image';
import { enhancePrompt } from '@/ai/flows/enhance-prompt';
import { imageToPrompt } from '@/ai/flows/image-to-prompt';
import { CreditError } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/components/error-boundary';
import { DashboardForm } from './dashboard-form';
import { DashboardResults } from './dashboard-results';
import { GenerationProgress } from './generation-progress';
import { PromptEnhancerDialog } from '@/components/prompt-enhancer-dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function DashboardContainer() {
  const { user, refreshUserData } = useAuth();
  const { 
    generation, 
    setGenerating, 
    setGenerationProgress, 
    setGenerationError, 
    setGeneratedImages,
    resetGeneration 
  } = useAppStore();
  
  const { toast } = useToast();
  const { error: componentError, setError } = useErrorHandler();

  const handleImageGeneration = useCallback(async (formData: any) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to generate images.',
      });
      return;
    }

    if (!user.emailVerified) {
      toast({
        variant: 'destructive',
        title: 'Verification Required',
        description: 'Please verify your email before generating images.',
      });
      return;
    }

    setGenerating(true);
    setGenerationError(null);
    setGeneratedImages(null);
    setGenerationProgress('generating');

    try {
      const promptId = crypto.randomUUID();
      const result = await generateImages({
        prompt: formData.prompt,
        aspectRatio: formData.aspectRatio,
        userId: user.uid,
        models: formData.models,
        promptId: promptId,
        useCase: formData.useCase,
        tones: formData.tones,
        inputImageDataUri: formData.inputImageDataUri,
      });

      setGenerationProgress('saving');
      setGeneratedImages(result);
      await refreshUserData();
      setGenerationProgress('done');
      
      // Auto-reset after 1 second
      setTimeout(() => {
        setGenerationProgress('idle');
      }, 1000);

    } catch (e) {
      if (e instanceof CreditError) {
        toast({
          variant: 'destructive',
          title: 'Insufficient Credits',
          description: e.message,
          action: (
            <Button asChild variant="secondary">
              <Link href="/pricing">Get Credits</Link>
            </Button>
          )
        });
      } else {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setGenerationError(errorMessage);
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: errorMessage,
        });
      }
    } finally {
      setGenerating(false);
    }
  }, [user, setGenerating, setGenerationProgress, setGenerationError, setGeneratedImages, refreshUserData, toast, setError]);

  const handlePromptEnhancement = useCallback(async (prompt: string, tones: string[]) => {
    try {
      const result = await enhancePrompt({ prompt, tones });
      return result.enhancedPrompt;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({ 
        variant: 'destructive', 
        title: 'Enhancement Failed', 
        description: errorMessage 
      });
      throw e;
    }
  }, [toast]);

  const handleImageToPrompt = useCallback(async (imageDataUri: string) => {
    try {
      const result = await imageToPrompt({ photoDataUri: imageDataUri });
      toast({ 
        title: 'Prompt Generated!', 
        description: 'The prompt has been populated in the text area.' 
      });
      return result.prompt;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({ 
        variant: 'destructive', 
        title: 'Analysis Failed', 
        description: errorMessage 
      });
      throw e;
    }
  }, [toast]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Please sign in to access the dashboard</p>
        <Button onClick={() => {}}>Sign In</Button>
      </div>
    );
  }

  if (componentError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{componentError}</p>
        <Button onClick={() => setError(null)}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <DashboardForm
          onSubmit={handleImageGeneration}
          onEnhancePrompt={handlePromptEnhancement}
          onImageToPrompt={handleImageToPrompt}
          isGenerating={generation.isGenerating}
        />
      </div>
      
      <div className="lg:col-span-2">
        <DashboardResults
          generatedImages={generation.generatedImages}
          isGenerating={generation.isGenerating}
          error={generation.error}
        />
      </div>

      <GenerationProgress state={generation.progress} />
      
      {/* Enhanced prompt dialog will be handled by the form component */}
    </div>
  );
} 