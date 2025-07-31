'use server';

/**
 * @fileOverview Generates a LinkedIn post from a description and instructions using AI.
 *
 * - generateLinkedInPost - A function that handles the generation of a LinkedIn post.
 * - GenerateLinkedInPostInput - The input type for the generateLinkedInPost function.
 * - GenerateLinkedInPostOutput - The return type for the generateLinkedInPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLinkedInPostInputSchema = z.object({
  description: z.string().describe('The description or title of the LinkedIn post.'),
  instructions: z.string().describe('Instructions for generating the LinkedIn post content.'),
  image: z.string().describe('URL of an image to include in the post.'),
});
export type GenerateLinkedInPostInput = z.infer<typeof GenerateLinkedInPostInputSchema>;

const GenerateLinkedInPostOutputSchema = z.object({
  postContent: z.string().describe('The generated content of the LinkedIn post.'),
  imageUrl: z.string().describe('The URL of the generated or selected image for the post.'),
});
export type GenerateLinkedInPostOutput = z.infer<typeof GenerateLinkedInPostOutputSchema>;

export async function generateLinkedInPost(input: GenerateLinkedInPostInput): Promise<GenerateLinkedInPostOutput> {
  return generateLinkedInPostFlow(input);
}

const generateLinkedInPostPrompt = ai.definePrompt({
  name: 'generateLinkedInPostPrompt',
  input: {schema: GenerateLinkedInPostInputSchema},
  output: {schema: GenerateLinkedInPostOutputSchema},
  prompt: `You are an AI assistant specialized in generating engaging LinkedIn posts.

  Based on the provided description, instructions, and image, create a compelling LinkedIn post.

  Description: {{{description}}}
  Instructions: {{{instructions}}}
  Image URL: {{{image}}}

  Ensure the post is professional, informative, and likely to capture the attention of LinkedIn users.
  Return the generated post content and the image URL.

  {{#if image}}
  The image URL is: {{image}}
  {{/if}}`,
});

const generateLinkedInPostFlow = ai.defineFlow(
  {
    name: 'generateLinkedInPostFlow',
    inputSchema: GenerateLinkedInPostInputSchema,
    outputSchema: GenerateLinkedInPostOutputSchema,
  },
  async input => {
    const {output} = await generateLinkedInPostPrompt(input);
    return output!;
  }
);
