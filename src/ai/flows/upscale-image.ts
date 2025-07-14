'use server';

/**
 * @fileOverview AI-powered image upscaling and outpainting flow.
 *
 * - upscaleImage - A function that expands an image to a new aspect ratio.
 * - UpscaleImageInput - The input type for the upscaleImage function.
 * - UpscaleImageOutput - The return type for the upscaleImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpscaleImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to upscale, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  aspectRatio: z.string().describe('The target aspect ratio for the new image.'),
});
export type UpscaleImageInput = z.infer<typeof UpscaleImageInputSchema>;

const UpscaleImageOutputSchema = z.object({
  upscaledPhotoDataUri: z
    .string()
    .describe(
      'The upscaled and expanded photo, as a data URI that includes a MIME type and uses Base64 encoding.'
    ),
});
export type UpscaleImageOutput = z.infer<typeof UpscaleImageOutputSchema>;

export async function upscaleImage(input: UpscaleImageInput): Promise<UpscaleImageOutput> {
  return upscaleImageFlow(input);
}

const systemPrompt = `You are an expert image editor. Your task is to intelligently expand the given image to fit the target aspect ratio.
Analyze the content, style, and lighting of the original image.
Generate new image data to fill the expanded canvas seamlessly, maintaining the original's quality and aesthetic.
The final output must be just the edited image.`;

const prompt = ai.definePrompt({
  name: 'upscaleImagePrompt',
  input: {schema: UpscaleImageInputSchema},
  output: {schema: UpscaleImageOutputSchema},
  system: systemPrompt,
  prompt: `Expand this image to a target aspect ratio of {{{aspectRatio}}}.

Image: {{media url=photoDataUri}}
`,
});

const upscaleImageFlow = ai.defineFlow(
  {
    name: 'upscaleImageFlow',
    inputSchema: UpscaleImageInputSchema,
    outputSchema: UpscaleImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
