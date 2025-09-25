'use server';
/**
 * @fileOverview A simple chat flow.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  prompt: z.string().describe("The user's prompt."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const prompt = ai.definePrompt(
    {
      name: 'chatPrompt',
      input: {schema: ChatInputSchema},
      output: {schema: ChatOutputSchema},
      prompt: `You are an expert AI tutor for Class 10 CBSE curriculum and general education topics.
  
  Please provide a helpful and accurate response to the following prompt:
  {{{prompt}}}
  `,
    },
    async input => {
      const llmResponse = await ai.generate({
        prompt: input.prompt,
        model: 'googleai/gemini-2.5-flash',
        output: {
            schema: ChatOutputSchema,
        },
      });
      return llmResponse.output!;
    }
  );
  return await prompt(input);
}
