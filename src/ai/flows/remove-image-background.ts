'use server';

/**
 * @fileOverview AI-powered background removal flow.
 *
 * - removeImageBackground - A function that removes the background of an image.
 * - RemoveImageBackgroundInput - The input type for the removeImageBackground function.
 * - RemoveImageBackgroundOutput - The return type for the removeImageBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemoveImageBackgroundInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to remove the background from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RemoveImageBackgroundInput = z.infer<typeof RemoveImageBackgroundInputSchema>;

const RemoveImageBackgroundOutputSchema = z.object({
  modifiedPhotoDataUri: z
    .string()
    .describe(
      'A photo with the background removed, as a data URI that includes a MIME type and uses Base64 encoding.'
    ),
});
export type RemoveImageBackgroundOutput = z.infer<typeof RemoveImageBackgroundOutputSchema>;

export async function removeImageBackground(input: RemoveImageBackgroundInput): Promise<RemoveImageBackgroundOutput> {
  return removeImageBackgroundFlow(input);
}

const removeImageBackgroundPrompt = ai.definePrompt({
  name: 'removeImageBackgroundPrompt',
  input: {schema: RemoveImageBackgroundInputSchema},
  output: {schema: RemoveImageBackgroundOutputSchema},
  prompt: `Remove the background from the image provided. Return the image as a data URI.

Image: {{media url=photoDataUri}}
`,
});

const removeImageBackgroundFlow = ai.defineFlow(
  {
    name: 'removeImageBackgroundFlow',
    inputSchema: RemoveImageBackgroundInputSchema,
    outputSchema: RemoveImageBackgroundOutputSchema,
  },
  async input => {
    const {output} = await removeImageBackgroundPrompt(input);
    return output!;
  }
);
