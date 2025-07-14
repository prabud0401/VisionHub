'use server';

/**
 * @fileOverview Generates an image, saves it to storage, and records its metadata.
 *
 * - generateImages - A function that handles the full image generation and saving process for multiple models.
 * - GenerateImagesInput - The input type for the generateImages function.
 * - GenerateImagesOutput - The return type for the generateImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  saveImageMetadata,
  uploadImageFromDataUri,
} from '@/services/image-service';
import type { GeneratedImage } from '@/lib/types';

const GenerateImagesInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  aspectRatio: z.string().describe('The aspect ratio of the image to generate.'),
  userId: z.string().describe('The ID of the user generating the image.'),
  models: z.array(z.string()).describe('The AI models used for generation.'),
  promptId: z.string().describe('A unique ID for the prompt session.'),
});

export type GenerateImagesInput = z.infer<typeof GenerateImagesInputSchema>;
export type GenerateImagesOutput = GeneratedImage[];

export async function generateImages(input: GenerateImagesInput): Promise<GenerateImagesOutput> {
  return generateImagesFlow(input);
}

// Map user-friendly names to actual model identifiers
const modelIdMap: Record<string, string> = {
  "Gemini AI": 'googleai/gemini-2.0-flash-preview-image-generation',
  "OpenAI DALL-E 3": 'googleai/gemini-2.0-flash-preview-image-generation', // Placeholder, assuming Gemini for all for now
  "Stability AI SDXL": 'googleai/gemini-2.0-flash-preview-image-generation', // Placeholder
  "DeepAI Image Generation": 'googleai/gemini-2.0-flash-preview-image-generation', // Placeholder
};


const generateImagesFlow = ai.defineFlow(
  {
    name: 'generateImagesFlow',
    inputSchema: GenerateImagesInputSchema,
    outputSchema: z.custom<GenerateImagesOutput>(),
  },
  async input => {
    const generationTasks = input.models.map(async (modelName) => {
      const modelId = modelIdMap[modelName];
      if (!modelId) {
        throw new Error(`Invalid model name provided: ${modelName}`);
      }

      const {media} = await ai.generate({
        model: modelId,
        prompt: `${input.prompt} --ar ${input.aspectRatio}`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media?.url) {
        throw new Error(`No image was generated for model ${modelName}.`);
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
        model: modelName,
        promptId: input.promptId,
        createdAt: new Date().toISOString(),
      };

      return saveImageMetadata(newImageMetadata);
    });

    const results = await Promise.all(generationTasks);
    return results;
  }
);
