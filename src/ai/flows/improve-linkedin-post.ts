'use server';

/**
 * @fileOverview AI agent that improves a LinkedIn post based on user input.
 *
 * - improveLinkedInPost - A function that improves a given LinkedIn post.
 * - ImproveLinkedInPostInput - The input type for the improveLinkedInPost function.
 * - ImproveLinkedInPostOutput - The return type for the improveLinkedInPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveLinkedInPostInputSchema = z.object({
  post: z.string().describe('The LinkedIn post to improve.'),
  prompt: z.string().describe('Instructions on how to improve the post.'),
});
export type ImproveLinkedInPostInput = z.infer<typeof ImproveLinkedInPostInputSchema>;

const ImproveLinkedInPostOutputSchema = z.object({
  improvedPost: z.string().describe('The improved LinkedIn post.'),
});
export type ImproveLinkedInPostOutput = z.infer<typeof ImproveLinkedInPostOutputSchema>;

export async function improveLinkedInPost(input: ImproveLinkedInPostInput): Promise<ImproveLinkedInPostOutput> {
  return improveLinkedInPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveLinkedInPostPrompt',
  input: {schema: ImproveLinkedInPostInputSchema},
  output: {schema: ImproveLinkedInPostOutputSchema},
  prompt: `You are an expert social media content improver.

  Improve the following LinkedIn post, using the following instructions.

  Post: {{{post}}}
  Instructions: {{{prompt}}}

  Improved Post:`,
});

const improveLinkedInPostFlow = ai.defineFlow(
  {
    name: 'improveLinkedInPostFlow',
    inputSchema: ImproveLinkedInPostInputSchema,
    outputSchema: ImproveLinkedInPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      improvedPost: output?.improvedPost ?? ''
    };
  }
);
