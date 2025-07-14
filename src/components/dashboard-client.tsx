'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Bot, Download, ImageIcon, Loader2 } from 'lucide-react';

import { generateImages } from '@/ai/flows/generate-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedImage } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { GenerationProgressModal } from './generation-progress-modal';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const models = [
  "Gemini AI",
  "OpenAI DALL-E 3",
  "Stability AI SDXL",
  "DeepAI Image Generation",
]

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
  models: z.array(z.string()).min(1, {
    message: "Please select at least one AI model."
  }),
  aspectRatio: z.string().default('1:1'),
});

type FormValues = z.infer<typeof formSchema>;

export function DashboardClient() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<'idle' | 'generating' | 'saving' | 'done'>('idle');
  const { toast } = useToast();
  const { user } = useAuth();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      models: ["Gemini AI"],
      aspectRatio: '1:1',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to generate images.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setProgressState('generating');
    try {
      const promptId = crypto.randomUUID();
      const result = await generateImages({
        prompt: values.prompt,
        aspectRatio: values.aspectRatio,
        userId: user.uid,
        models: values.models,
        promptId: promptId,
      });

      setProgressState('saving');
      
      setGeneratedImages(result);
      
      setProgressState('done');
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setProgressState('idle');
    }
  }

  return (
    <>
      <GenerationProgressModal state={progressState} />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Create Your Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="models"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AI Models</FormLabel>
                      <ToggleGroup
                        type="multiple"
                        variant="outline"
                        className="flex flex-wrap justify-start gap-2"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {models.map(model => (
                           <ToggleGroupItem key={model} value={model} className="flex-grow sm:flex-grow-0">
                            {model}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                       <FormDescription>
                        Select one or more models to generate images with.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A futuristic city skyline at sunset, digital art"
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aspectRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aspect Ratio</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an aspect ratio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1:1">Square (1:1)</SelectItem>
                          <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                          <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                          <SelectItem value="4:3">Standard (4:3)</SelectItem>
                          <SelectItem value="3:2">Classic (3:2)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Generate Images
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Result</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full min-h-[300px]">
            {isLoading && !generatedImages && (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p>Hold on, magic is happening...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && generatedImages && (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="grid grid-cols-2 gap-2 w-full">
                  {generatedImages.map((image) => (
                    <div key={image.id} className="relative aspect-square">
                      <Image
                        src={image.url}
                        alt={image.prompt}
                        fill
                        className="rounded-lg object-contain border"
                      />
                       <div className="absolute bottom-1 right-1 bg-background/70 text-foreground text-xs px-1.5 py-0.5 rounded">
                        {image.model}
                      </div>
                    </div>
                  ))}
                </div>
                 {generatedImages.length > 0 && (
                    <Button asChild variant="outline" className="w-full">
                       <a href={generatedImages[0].url} download={`visionhub-ai-${generatedImages[0].id}.png`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download First Image
                      </a>
                    </Button>
                 )}
              </div>
            )}
            {!isLoading && !error && !generatedImages && (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                <p>Your generated images will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
