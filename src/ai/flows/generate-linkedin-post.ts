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
  image: z.string().describe('A prompt or URL for an image to include in the post.'),
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

  Based on the provided description, instructions, and image prompt/URL, create a compelling LinkedIn post.

  Description: {{{description}}}
  Instructions: {{{instructions}}}
  Image Prompt/URL: {{{image}}}

  Ensure the post is professional, informative, and likely to capture the attention of LinkedIn users.
  Return the generated post content and the image URL.

  {{#if image}}
  If the user provided a URL in the 'Image Prompt/URL' field, use that as the imageUrl in the output. If they provided a prompt, generate an image based on that prompt and use the resulting URL. If no image prompt or URL is provided, use 'https://placehold.co/1200x628.png'.
  The image URL is: {{image}}
  {{else}}
  The image URL is: https://placehold.co/1200x628.png
  {{/if}}`,
});

const generateImagePrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {
    schema: z.object({
      prompt: z.string(),
    }),
  },
  output: {
    schema: z.object({
      imageUrl: z.string(),
    }),
  },
  prompt: `Generate an image for a LinkedIn post based on the following prompt: {{{prompt}}}`,
  model: 'googleai/gemini-2.0-flash-preview-image-generation',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
});

const generateLinkedInPostFlow = ai.defineFlow(
  {
    name: 'generateLinkedInPostFlow',
    inputSchema: GenerateLinkedInPostInputSchema,
    outputSchema: GenerateLinkedInPostOutputSchema,
  },
  async input => {
    let imageUrl = 'https://placehold.co/1200x628.png';

    if (input.image) {
      const isUrl = input.image.startsWith('http://') || input.image.startsWith('https://');
      if (isUrl) {
        imageUrl = input.image;
      } else {
        // It's a prompt, so generate an image
        const { media } = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: input.image,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
        if (media?.url) {
          imageUrl = media.url;
        }
      }
    }

    const postGenInput = { ...input, image: imageUrl };
    const { output } = await generateLinkedInPostPrompt(postGenInput);
    
    return {
      postContent: output?.postContent ?? '',
      imageUrl: imageUrl,
    };
  }
);