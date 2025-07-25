'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { Bot, Download, ImageIcon, Loader2, Sparkles, WandSparkles, UploadCloud, BrainCircuit, Gem, Briefcase, RefreshCw, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PromptEnhancerDialog } from '@/components/prompt-enhancer-dialog';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const models = [
  "Gemini AI",
  "OpenAI DALL-E 3", 
  "Stability AI SDXL",
  "DeepAI Image Generation",
] as const;

const tones = [
  "Cinematic", "Photorealistic", "Fantasy", "Anime", "Cyberpunk",
  "Vintage", "Minimalist", "Vibrant", "Surreal", "Impressionistic"
] as const;

const useCases = [
  { value: "none", label: "General / None" },
  { value: "social-media-post", label: "Social Media Post" },
  { value: "blog-illustration", label: "Blog / Website Illustration" },
  { value: "concept-art", label: "Concept Art (Games/Film)" },
  { value: "youtube-thumbnail", label: "YouTube Thumbnail" },
  { value: "advertisement-creative", label: "Advertisement Creative" },
  { value: "presentation-graphic", label: "Presentation Graphic" },
  { value: "personal-avatar", label: "Profile Picture / Avatar" },
] as const;

const aspectRatios = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:3", label: "Classic (4:3)" },
  { value: "3:2", label: "Photo (3:2)" },
] as const;

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
  models: z.array(z.string()).min(1, {
    message: "Please select at least one AI model."
  }),
  tones: z.array(z.string()).optional(),
  aspectRatio: z.string().default('1:1'),
  useCase: z.string().optional().default('none'),
  inputImageDataUri: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DashboardFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  onEnhancePrompt: (prompt: string, tones: string[]) => Promise<string>;
  onImageToPrompt: (imageDataUri: string) => Promise<string>;
  isGenerating: boolean;
}

// Memoized model selection component
const ModelSelection = memo(({ value, onChange }: { value: string[], onChange: (value: string[]) => void }) => (
  <FormItem>
    <FormLabel>AI Models</FormLabel>
    <FormControl>
      <ToggleGroup type="multiple" value={value} onValueChange={onChange} className="justify-start flex-wrap">
        {models.map((model) => (
          <ToggleGroupItem key={model} value={model} aria-label={`Select ${model}`}>
            {model}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FormControl>
    <FormDescription>
      Select one or more AI models. More models = more credits but diverse results.
    </FormDescription>
    <FormMessage />
  </FormItem>
));

ModelSelection.displayName = 'ModelSelection';

// Memoized tone selection component
const ToneSelection = memo(({ value, onChange }: { value: string[], onChange: (value: string[]) => void }) => (
  <FormItem>
    <FormLabel>Style Tones (Optional)</FormLabel>
    <FormControl>
      <ToggleGroup type="multiple" value={value} onValueChange={onChange} className="justify-start flex-wrap">
        {tones.map((tone) => (
          <ToggleGroupItem key={tone} value={tone} aria-label={`Select ${tone} tone`}>
            {tone}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FormControl>
    <FormDescription>
      Choose artistic styles to influence the generation.
    </FormDescription>
  </FormItem>
));

ToneSelection.displayName = 'ToneSelection';

// Memoized image upload component
const ImageUpload = memo(({ 
  value, 
  onChange, 
  onAnalyze, 
  isAnalyzing 
}: { 
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const handleRemoveImage = useCallback(() => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  return (
    <FormItem>
      <FormLabel>Input Image (Optional)</FormLabel>
      <FormControl>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            {value && (
              <Button
                type="button"
                variant="outline"
                onClick={onAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                Analyze
              </Button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {value && (
            <div className="relative aspect-square w-full max-w-xs mx-auto border rounded-lg overflow-hidden">
              <Image 
                src={value} 
                alt="Input image" 
                fill 
                className="object-cover" 
                sizes="(max-width: 384px) 100vw, 384px"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>
        Upload an image for image-to-image generation or analysis.
      </FormDescription>
    </FormItem>
  );
});

ImageUpload.displayName = 'ImageUpload';

export function DashboardForm({ 
  onSubmit, 
  onEnhancePrompt, 
  onImageToPrompt, 
  isGenerating 
}: DashboardFormProps) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [enhancerState, setEnhancerState] = useState({
    isOpen: false,
    original: '',
    enhanced: '',
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: searchParams.get('prompt') || '',
      models: ["Gemini AI"],
      tones: [],
      aspectRatio: '1:1',
      useCase: 'none',
      inputImageDataUri: undefined,
    },
  });

  // Update form when URL changes
  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      form.setValue('prompt', urlPrompt);
    }
  }, [searchParams, form]);

  const handleEnhancePrompt = useCallback(async () => {
    const currentPrompt = form.getValues('prompt');
    const currentTones = form.getValues('tones') || [];
    
    if (!currentPrompt) {
      form.trigger('prompt');
      return;
    }
    
    setIsEnhancing(true);
    try {
      const enhanced = await onEnhancePrompt(currentPrompt, currentTones);
      setEnhancerState({
        isOpen: true,
        original: currentPrompt,
        enhanced,
      });
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsEnhancing(false);
    }
  }, [form, onEnhancePrompt]);

  const handleAcceptEnhancedPrompt = useCallback((newPrompt: string) => {
    form.setValue('prompt', newPrompt, { shouldValidate: true });
    setEnhancerState(prev => ({ ...prev, isOpen: false }));
  }, [form]);

  const handleImageToPrompt = useCallback(async () => {
    const inputImage = form.getValues('inputImageDataUri');
    if (!inputImage) {
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const prompt = await onImageToPrompt(inputImage);
      form.setValue('prompt', prompt, { shouldValidate: true });
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsAnalyzing(false);
    }
  }, [form, onImageToPrompt]);

  const handleFormSubmit = useCallback(async (values: FormValues) => {
    await onSubmit(values);
  }, [onSubmit]);

  return (
    <>
      <Card className="h-fit sticky top-24">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Create Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Prompt Field */}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Creative Prompt</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="A majestic dragon soaring through a cloudy sky at sunset..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleEnhancePrompt}
                            disabled={isEnhancing || !field.value}
                            className="flex-1"
                          >
                            {isEnhancing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enhancing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Enhance Prompt
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Describe what you want to create. Be specific for better results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model Selection */}
              <FormField
                control={form.control}
                name="models"
                render={({ field }) => (
                  <ModelSelection value={field.value} onChange={field.onChange} />
                )}
              />

              {/* Tone Selection */}
              <FormField
                control={form.control}
                name="tones"
                render={({ field }) => (
                  <ToneSelection value={field.value || []} onChange={field.onChange} />
                )}
              />

              {/* Aspect Ratio */}
              <FormField
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspect Ratio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select aspect ratio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {aspectRatios.map((ratio) => (
                          <SelectItem key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Use Case */}
              <FormField
                control={form.control}
                name="useCase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use Case</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select use case" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {useCases.map((useCase) => (
                          <SelectItem key={useCase.value} value={useCase.value}>
                            {useCase.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the intended use to optimize the generation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="inputImageDataUri"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onAnalyze={handleImageToPrompt}
                    isAnalyzing={isAnalyzing}
                  />
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isGenerating} 
                size="lg" 
                className="w-full"
              >
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

              {/* Credits Info */}
              {user && (
                <div className="text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Gem className="h-4 w-4 text-primary" />
                    <span>You have {user.credits ?? 0} credits</span>
                  </div>
                  <p className="mt-1">
                    This generation will use {form.watch('models').length} credit(s)
                  </p>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Prompt Enhancer Dialog */}
      <PromptEnhancerDialog
        isOpen={enhancerState.isOpen}
        onOpenChange={(isOpen) => setEnhancerState(prev => ({ ...prev, isOpen }))}
        originalPrompt={enhancerState.original}
        enhancedPrompt={enhancerState.enhanced}
        onAccept={handleAcceptEnhancedPrompt}
      />
    </>
  );
} 