'use server';

/**
 * @fileOverview An AI flow for generating a text prompt from an image.
 *
 * - imageToPrompt - A function that analyzes an image and creates a descriptive prompt.
 * - ImageToPromptInput - The input type for the imageToPrompt function.
 * - ImageToPromptOutput - The return type for the imageToPtompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageToPromptInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageToPromptInput = z.infer<typeof ImageToPromptInputSchema>;

const ImageToPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated descriptive prompt for the image.'),
});
export type ImageToPromptOutput = z.infer<typeof ImageToPromptOutputSchema>;


export async function imageToPrompt(input: ImageToPromptInput): Promise<ImageToPromptOutput> {
  return imageToPromptFlow(input);
}


const systemPrompt = `You are an expert in visual analysis and prompt engineering for generative AI image models. Your task is to analyze the provided image and generate a detailed, descriptive text prompt that could be used to recreate a similar image.

Describe the key elements, the style, the composition, the lighting, and any other relevant visual details. The prompt should be a single, concise paragraph. Do not add any preamble or explanation.`;

const prompt = ai.definePrompt({
  name: 'imageToPromptPrompt',
  model: 'googleai/gemini-pro-vision',
  input: {schema: ImageToPromptInputSchema},
  output: {schema: ImageToPromptOutputSchema},
  system: systemPrompt,
  prompt: `Analyze this image and generate a prompt.
Image: {{media url=photoDataUri}}
`,
});

const imageToPromptFlow = ai.defineFlow(
  {
    name: 'imageToPromptFlow',
    inputSchema: ImageToPromptInputSchema,
    outputSchema: ImageToPromptOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output;

    if (!output) {
      throw new Error(
        `The AI model failed to return a valid prompt. Raw response: ${llmResponse.text}`
      );
    }
    
    return output;
  }
);
