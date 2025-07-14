'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Bot, Download, ImageIcon, Loader2 } from 'lucide-react';

import { generateImage } from '@/ai/flows/generate-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedImage } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { GenerationProgressModal } from './generation-progress-modal';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
  model: z.string({
    required_error: 'Please select an AI model.',
  }),
  orientation: z.string().default('square'),
  aspectRatio: z.string().default('1:1'),
});

type FormValues = z.infer<typeof formSchema>;

export function DashboardClient() {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<'idle' | 'generating' | 'saving' | 'done'>('idle');
  const { toast } = useToast();
  const { user } = useAuth();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      model: 'Gemini AI',
      orientation: 'square',
      aspectRatio: '1:1',
    },
  });

  const orientation = form.watch('orientation');

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
    setGeneratedImage(null);
    setProgressState('generating');
    try {
      const result = await generateImage({ 
        prompt: values.prompt,
        aspectRatio: values.aspectRatio,
        userId: user.uid,
        model: values.model
      });

      setProgressState('saving');
      
      setGeneratedImage(result);
      
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
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AI Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an AI model to use" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Gemini AI">Gemini AI</SelectItem>
                          <SelectItem value="OpenAI DALL-E 3">OpenAI DALL-E 3</SelectItem>
                          <SelectItem value="Stability AI SDXL">Stability AI SDXL</SelectItem>
                          <SelectItem value="DeepAI Image Generation">DeepAI Image Generation</SelectItem>
                        </SelectContent>
                      </Select>
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
                  name="orientation"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Orientation</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            const ratio = { square: '1:1', portrait: '9:16', landscape: '16:9' }[value] || '1:1';
                            form.setValue('aspectRatio', ratio);
                          }}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="square" />
                            </FormControl>
                            <FormLabel className="font-normal">Square</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="portrait" />
                            </FormControl>
                            <FormLabel className="font-normal">Portrait</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="landscape" />
                            </FormControl>
                            <FormLabel className="font-normal">Landscape</FormLabel>
                          </FormItem>
                        </RadioGroup>
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
                          {orientation === 'square' && <SelectItem value="1:1">1:1</SelectItem>}
                          {orientation === 'portrait' && (
                            <>
                              <SelectItem value="9:16">9:16</SelectItem>
                              <SelectItem value="2:3">2:3</SelectItem>
                              <SelectItem value="4:5">4:5</SelectItem>
                            </>
                          )}
                          {orientation === 'landscape' && (
                            <>
                              <SelectItem value="16:9">16:9</SelectItem>
                              <SelectItem value="3:2">3:2</SelectItem>
                              <SelectItem value="5:4">5:4</SelectItem>
                            </>
                          )}
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
                      Generate Image
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
            {isLoading && !generatedImage && (
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
            {!isLoading && !error && generatedImage && (
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={generatedImage.url}
                  alt={generatedImage.prompt}
                  width={512}
                  height={512}
                  className="rounded-lg object-contain aspect-square border"
                />
                <Button asChild variant="outline">
                  <a href={generatedImage.url} download={`visionhub-ai-${generatedImage.id}.png`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            )}
            {!isLoading && !error && !generatedImage && (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                <p>Your generated image will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
