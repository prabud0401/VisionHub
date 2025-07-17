'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Bot, Download, Loader2, Video, WandSparkles } from 'lucide-react';

import { generateVideo } from '@/ai/flows/generate-video';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedVideo } from '@/lib/types';
import { CreditError } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useAuth } from '@/context/auth-context';
import { VerifyEmailCard } from './verify-email-card';
import Link from 'next/link';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function VideoGenerationClient() {
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user, sendVerificationEmail, refreshUserData } = useAuth();


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to generate videos.',
      });
      return;
    }

    if (!user.emailVerified) {
      toast({
        variant: 'destructive',
        title: 'Verification Required',
        description: 'Please verify your email before generating videos.',
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);
    try {
      const promptId = crypto.randomUUID();
      const result = await generateVideo({
        prompt: values.prompt,
        userId: user.uid,
        promptId: promptId,
      });

      setGeneratedVideo(result);
      await refreshUserData();
      toast({
        title: 'Video Generated!',
        description: 'Your new video is ready and has been saved to your gallery.',
      });

    } catch (e) {
      if (e instanceof CreditError) {
        toast({
          variant: 'destructive',
          title: 'Insufficient Credits',
          description: "You don't have enough credits for this generation. Please purchase more.",
          action: (
             <Button asChild variant="secondary">
                <Link href="/pricing">Get Credits</Link>
             </Button>
          )
        });
      } else {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: errorMessage,
        });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  if (user && !user.emailVerified) {
    return <VerifyEmailCard userEmail={user.email} onResend={sendVerificationEmail} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center">
                     1. Describe Your Scene
                  </CardTitle>
                </CardHeader>
                 <CardContent>
                      <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel className="sr-only">Prompt</FormLabel>
                          <FormControl>
                              <Textarea
                              placeholder="e.g., A cinematic shot of a futuristic city with flying cars at night"
                              className="resize-none"
                              rows={5}
                              {...field}
                              />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                 </CardContent>
               </Card>
              
              <Button type="submit" disabled={isGenerating} size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Generate Video (10 Credits)
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
              {isGenerating && !generatedVideo && (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p>Hold on, your video is rendering...</p>
                </div>
              )}
              {error && (
                <Alert variant="destructive" className="w-full">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!isGenerating && !error && generatedVideo && (
                <div className="flex flex-col items-center gap-4 w-full">
                   <div className="relative aspect-video w-full">
                      <video
                        src={generatedVideo.url}
                        controls
                        autoPlay
                        className="rounded-lg object-contain border bg-black w-full h-full"
                      />
                    </div>
                    <Button asChild variant="outline" className="mt-4">
                        <a href={generatedVideo.url} download={`visionhub-ai-video-${generatedVideo.id}.mp4`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Video
                        </a>
                    </Button>
                </div>
              )}
              {!isGenerating && !error && !generatedVideo && (
                <div className="text-center text-muted-foreground">
                  <Video className="h-16 w-16 mx-auto mb-4" />
                  <p>Your generated video will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
