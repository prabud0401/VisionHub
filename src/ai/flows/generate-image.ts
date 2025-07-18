
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
  getImageCountForUser,
  saveImageMetadata,
  uploadImageFromDataUri,
} from '@/services/image-service';
import type { GeneratedImage } from '@/lib/types';
import { CreditError } from '@/lib/types';
import { deductUserCredit, getUserByUid } from '@/services/user-service';

const GenerateImagesInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  aspectRatio: z.string().describe('The aspect ratio of the image to generate.'),
  userId: z.string().describe('The ID of the user generating the image.'),
  models: z.array(z.string()).describe('The AI models used for generation.'),
  promptId: z.string().describe('A unique ID for the prompt session.'),
  useCase: z.string().optional().describe('The intended use case for the image.'),
  tones: z.array(z.string()).optional().describe('The stylistic tones applied to the prompt.'),
  inputImageDataUri: z.string().optional().describe(
    "An optional input image as a data URI for image-to-image generation. Format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});

export type GenerateImagesInput = z.infer<typeof GenerateImagesInputSchema>;
export type GenerateImagesOutput = GeneratedImage[];

export async function generateImages(input: GenerateImagesInput): Promise<GenerateImagesOutput> {
  try {
    return await generateImagesFlow(input);
  } catch(e) {
    if (e instanceof CreditError) {
      // Re-throw the custom error so the client can catch it specifically.
      throw e;
    }
    // For other errors, wrap them in a standard Error object.
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during image generation.';
    throw new Error(errorMessage);
  }
}

const generateImagesFlow = ai.defineFlow(
  {
    name: 'generateImagesFlow',
    inputSchema: GenerateImagesInputSchema,
    outputSchema: z.custom<GenerateImagesOutput>(),
  },
  async input => {
    // Check user credits and gallery limit before proceeding
    const userProfile = await getUserByUid(input.userId);
    const creditsToDeduct = input.models.length;

    if (!userProfile) {
        throw new CreditError("User profile not found.");
    }

    if ((userProfile.credits ?? 0) < creditsToDeduct) {
        throw new CreditError("You don't have enough credits to generate these images.");
    }

    // Check gallery storage limit
    const currentImageCount = await getImageCountForUser(input.userId);
    const storageLimit = userProfile.storageLimit || 50; // Default to 50 if not set

    if (storageLimit !== -1 && currentImageCount >= storageLimit) {
        throw new CreditError(`You have reached your gallery limit of ${storageLimit} images. Please upgrade your plan for more space or delete some images.`);
    }

    // Prepend the use case to the prompt if it exists
    let finalPrompt = input.useCase && input.useCase !== 'none'
      ? `Generate an image for a '${input.useCase}': ${input.prompt}`
      : input.prompt;
      
    finalPrompt += ` --ar ${input.aspectRatio}`;

    // Construct the prompt for the AI model
    const aiPrompt: (string | { media: { url: string } })[] = [{ text: finalPrompt }];
    if (input.inputImageDataUri) {
      aiPrompt.unshift({ media: { url: input.inputImageDataUri } });
    }


    const generationTasks = input.models.map(async (modelName) => {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: aiPrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!media?.url) {
        throw new Error(`No image was generated for model ${modelName}.`);
      }

      // Deduct credit *after* successful generation
      await deductUserCredit(input.userId, 1);

      const imageId = crypto.randomUUID();
      const fileName = `${imageId}.png`;

      // Upload image to Firebase Storage
      const publicUrl = await uploadImageFromDataUri(media.url, fileName);
      
      // Save metadata to Firestore
      const newImageMetadata = {
        userId: input.userId,
        url: publicUrl,
        prompt: input.prompt, // Save the original user prompt
        model: modelName,
        promptId: input.promptId,
        createdAt: new Date().toISOString(),
        aspectRatio: input.aspectRatio,
        useCase: input.useCase,
        tones: input.tones,
      };

      return saveImageMetadata(newImageMetadata);
    });

    const results = await Promise.all(generationTasks);
    return results;
  }
);
