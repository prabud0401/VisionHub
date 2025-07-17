'use server';

/**
 * @fileOverview Generates a video, saves it to storage, and records its metadata.
 *
 * - generateVideo - A function that handles the video generation and saving process.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  saveVideoMetadata,
  uploadVideoFromUrl,
} from '@/services/video-service';
import type { GeneratedVideo } from '@/lib/types';
import { CreditError } from '@/lib/types';
import { deductUserCredit, getUserByUsername } from '@/services/user-service';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a video from.'),
  userId: z.string().describe('The ID of the user generating the video.'),
  promptId: z.string().describe('A unique ID for the prompt session.'),
});

export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;
export type GenerateVideoOutput = GeneratedVideo;

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  try {
    return await generateVideoFlow(input);
  } catch(e) {
    if (e instanceof CreditError) {
      // Re-throw the custom error so the client can catch it specifically.
      throw e;
    }
    // For other errors, wrap them in a standard Error object.
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during video generation.';
    throw new Error(errorMessage);
  }
}

const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: z.custom<GenerateVideoOutput>(),
  },
  async input => {
    // Check user credits before proceeding
    const userProfile = await getUserByUsername(input.userId, true);
    // Let's assume video generation costs 10 credits
    const creditsToDeduct = 10;

    if (!userProfile || (userProfile.credits ?? 0) < creditsToDeduct) {
        // Throw a specific error for credits
        throw new CreditError(`You need at least ${creditsToDeduct} credits to generate a video.`);
    }

    //
    // TODO: Replace with an actual video generation model call when available.
    // The following is a simulation.
    //
    // const {media} = await ai.generate({
    //   model: 'googleai/some-video-generation-model',
    //   prompt: input.prompt,
    // });
    // const videoUrl = media.url;
    //

    // Simulate a delay and a placeholder video URL.
    await new Promise(resolve => setTimeout(resolve, 5000));
    const placeholderVideoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    
    if (!placeholderVideoUrl) {
        throw new Error(`Video generation failed.`);
    }

    // Deduct credit *after* successful generation
    await deductUserCredit(input.userId, creditsToDeduct);

    const videoId = crypto.randomUUID();
    const fileName = `${videoId}.mp4`;

    // "Upload" placeholder video to Firebase Storage (in a real scenario, you'd upload the generated file)
    const publicUrl = await uploadVideoFromUrl(placeholderVideoUrl, fileName);
    
    // Save metadata to Firestore
    const newVideoMetadata = {
      userId: input.userId,
      url: publicUrl,
      prompt: input.prompt,
      model: "Simulated Video Model",
      promptId: input.promptId,
      createdAt: new Date().toISOString(),
    };

    return saveVideoMetadata(newVideoMetadata);
  }
);
