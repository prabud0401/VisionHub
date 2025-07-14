'use server';

/**
 * @fileOverview Generates an image, saves it to storage, and records its metadata.
 *
 * - generateImage - A function that handles the full image generation and saving process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  saveImageMetadata,
  uploadImageFromDataUri,
} from '@/services/image-service';
import type { GeneratedImage } from '@/lib/types';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  aspectRatio: z.string().describe('The aspect ratio of the image to generate.'),
  userId: z.string().describe('The ID of the user generating the image.'),
  model: z.string().describe('The AI model used for generation.'),
});

export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;
export type GenerateImageOutput = GeneratedImage;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: z.custom<GenerateImageOutput>(),
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `${input.prompt} --ar ${input.aspectRatio}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('No image was generated.');
    }

    const imageId = crypto.randomUUID();
    const fileName = `${imageId}.png`;

    // Upload image to Firebase Storage
    const publicUrl = await uploadImageFromDataUri(media.url, fileName);
    
    // Save metadata to Firestore
    const newImageMetadata = {
      userId: input.userId,
      url: publicUrl,
      prompt: input.prompt,
      model: input.model,
      createdAt: new Date().toISOString(),
    };

    const savedImage = await saveImageMetadata(newImageMetadata);
    
    return savedImage;
  }
);
