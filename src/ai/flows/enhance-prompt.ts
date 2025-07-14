'use server';

/**
 * @fileOverview An AI flow for enhancing user image prompts.
 *
 * - enhancePrompt - A function that rewrites a user's prompt to be more descriptive.
 * - EnhancePromptInput - The input type for the enhancePrompt function.
 * - EnhancePromptOutput - The return type for the enhancePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhancePromptInputSchema = z.object({
  prompt: z.string().describe('The original user prompt to enhance.'),
  tones: z.array(z.string()).describe('A list of stylistic tones to apply.'),
});
export type EnhancePromptInput = z.infer<typeof EnhancePromptInputSchema>;

const EnhancePromptOutputSchema = z.object({
  enhancedPrompt: z
    .string()
    .describe('The new, enhanced prompt.'),
});
export type EnhancePromptOutput = z.infer<typeof EnhancePromptOutputSchema>;


export async function enhancePrompt(input: EnhancePromptInput): Promise<EnhancePromptOutput> {
  return enhancePromptFlow(input);
}


const enhancePromptSystemPrompt = `You are a prompt engineering expert, skilled in transforming simple user ideas into rich, descriptive, and visually evocative prompts for generative AI image models.

Your task is to rewrite the user's prompt. You must adhere to the following rules:
- Expand on the user's original idea, adding details about the subject, setting, lighting, and composition.
- Incorporate the stylistic tones provided by the user.
- The final prompt should be a single, concise paragraph.
- Do not add any preamble or explanation. Only return the enhanced prompt.`;

const prompt = ai.definePrompt({
  name: 'enhancePromptPrompt',
  input: {schema: EnhancePromptInputSchema},
  output: {schema: EnhancePromptOutputSchema},
  system: enhancePromptSystemPrompt,
  prompt: `Original Prompt: {{{prompt}}}
{{#if tones.length}}
Stylistic Tones to apply: {{#each tones}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
`,
});

const enhancePromptFlow = ai.defineFlow(
  {
    name: 'enhancePromptFlow',
    inputSchema: EnhancePromptInputSchema,
    outputSchema: EnhancePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
