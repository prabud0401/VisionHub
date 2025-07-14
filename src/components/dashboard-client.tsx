
'use client';

import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Bot, Download, ImageIcon, Loader2, Sparkles, WandSparkles, UploadCloud, BrainCircuit } from 'lucide-react';

import { generateImages } from '@/ai/flows/generate-image';
import { enhancePrompt } from '@/ai/flows/enhance-prompt';
import { imageToPrompt } from '@/ai/flows/image-to-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedImage } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { GenerationProgressModal } from './generation-progress-modal';
import { PromptEnhancerDialog } from './prompt-enhancer-dialog';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerifyEmailCard } from './verify-email-card';

const models = [
  "Gemini AI",
  "OpenAI DALL-E 3",
  "Stability AI SDXL",
  "DeepAI Image Generation",
]

const tones = [
  "Cinematic", "Photorealistic", "Fantasy", "Anime", "Cyberpunk",
  "Vintage", "Minimalist", "Vibrant", "Surreal", "Impressionistic"
];


const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
  models: z.array(z.string()).min(1, {
    message: "Please select at least one AI model."
  }),
  tones: z.array(z.string()).optional(),
  aspectRatio: z.string().default('1:1'),
});

type FormValues = z.infer<typeof formSchema>;

export function DashboardClient() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<'idle' | 'generating' | 'saving' | 'done'>('idle');
  const [enhancerState, setEnhancerState] = useState({ isOpen: false, original: '', enhanced: '' });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { user, sendVerificationEmail } = useAuth();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      models: ["Gemini AI"],
      tones: [],
      aspectRatio: '1:1',
    },
  });

  const handleEnhancePrompt = async () => {
    const currentPrompt = form.getValues('prompt');
    const currentTones = form.getValues('tones') || [];
    if (!currentPrompt) {
      form.trigger('prompt');
      return;
    }
    
    setIsEnhancing(true);
    try {
      const result = await enhancePrompt({ prompt: currentPrompt, tones: currentTones });
      setEnhancerState({ isOpen: true, original: currentPrompt, enhanced: result.enhancedPrompt });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({ variant: 'destructive', title: 'Enhancement Failed', description: errorMessage });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAcceptEnhancedPrompt = (newPrompt: string) => {
    form.setValue('prompt', newPrompt, { shouldValidate: true });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageToPrompt = async () => {
    if (!uploadedImage) {
      toast({ variant: 'destructive', title: 'No Image', description: 'Please upload an image first.' });
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await imageToPrompt({ photoDataUri: uploadedImage });
      form.setValue('prompt', result.prompt, { shouldValidate: true });
      toast({ title: 'Prompt Generated!', description: 'The prompt has been populated in the text area.' });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      toast({ variant: 'destructive', title: 'Analysis Failed', description: errorMessage });
    } finally {
      setIsAnalyzing(false);
    }
  };


  async function onSubmit(values: FormValues) {
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

    setIsGenerating(true);
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
      setIsGenerating(false);
      setProgressState('idle');
    }
  }

  if (user && !user.emailVerified) {
    return <VerifyEmailCard userEmail={user.email} onResend={sendVerificationEmail} />;
  }

  return (
    <>
      <GenerationProgressModal state={progressState} />
      <PromptEnhancerDialog 
        isOpen={enhancerState.isOpen}
        onOpenChange={(isOpen) => setEnhancerState(prev => ({ ...prev, isOpen }))}
        originalPrompt={enhancerState.original}
        enhancedPrompt={enhancerState.enhanced}
        onAccept={handleAcceptEnhancedPrompt}
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <Card>
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center">
                       1. Craft Your Vision
                    </CardTitle>
                  </CardHeader>
                   <CardContent>
                    <Tabs defaultValue="text">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="text">Text Prompt</TabsTrigger>
                            <TabsTrigger value="image">Image to Prompt</TabsTrigger>
                        </TabsList>
                        <TabsContent value="text" className="pt-4">
                            <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="sr-only">Prompt</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="e.g., A majestic lion with a crown of stars, digital painting"
                                    className="resize-none"
                                    rows={5}
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <Button type="button" variant="outline" size="sm" onClick={handleEnhancePrompt} disabled={isEnhancing} className="mt-2 float-right">
                                {isEnhancing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                <WandSparkles className="mr-2 h-4 w-4" />
                                )}
                                Enhance Prompt
                            </Button>
                        </TabsContent>
                        <TabsContent value="image" className="pt-4">
                          <div className="space-y-4">
                            { !uploadedImage && (
                              <div
                                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent hover:border-accent-foreground/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-md font-semibold">Click to upload an image</p>
                                <p className="text-sm text-muted-foreground">The AI will generate a prompt from it.</p>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  className="hidden"
                                  accept="image/png, image/jpeg, image/webp"
                                />
                              </div>
                            )}
                            { uploadedImage && (
                              <div className="space-y-4">
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                                  <Image src={uploadedImage} alt="Uploaded for analysis" fill className="object-contain" />
                                </div>
                                <Button type="button" onClick={handleImageToPrompt} disabled={isAnalyzing} className="w-full">
                                  {isAnalyzing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <BrainCircuit className="mr-2 h-4 w-4" />
                                  )}
                                  Analyze and Generate Prompt
                                </Button>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                    </Tabs>

                       <FormField
                        control={form.control}
                        name="tones"
                        render={({ field }) => (
                          <FormItem className="mt-6 border-t pt-6">
                            <FormLabel className="font-semibold text-base">Stylistic Tones (optional)</FormLabel>
                             <ToggleGroup
                              type="multiple"
                              variant="outline"
                              className="flex flex-wrap justify-start gap-2 pt-2"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              {tones.map(tone => (
                                <ToggleGroupItem key={tone} value={tone} size="sm">
                                  {tone}
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </CardContent>
                 </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">2. Configure</CardTitle>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-6">
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
                    </CardContent>
                 </Card>
                
                <Button type="submit" disabled={isGenerating} size="lg" className="w-full">
                  {isGenerating ? (
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
        </div>

        <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-headline">Result</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                {isGenerating && !generatedImages && (
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
                {!isGenerating && !error && generatedImages && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
                        <Button asChild variant="outline" className="w-full mt-4">
                          <a href={generatedImages[0].url} download={`visionhub-ai-${generatedImages[0].id}.png`}>
                            <Download className="mr-2 h-4 w-4" />
                            Download First Image
                          </a>
                        </Button>
                    )}
                  </div>
                )}
                {!isGenerating && !error && !generatedImages && (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                    <p>Your generated images will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
