'use server';
/**
 * @fileOverview This flow generates personalized study materials for every user prompt.
 *
 * - chat - A function that handles the generation of personalized study materials.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  prompt: z.string().describe("The user's prompt or question."),
  conversationHistory: z
    .string()
    .describe(
      'The preceding conversation history between the student and the AI tutor.'
    ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  mindMap: z.string().describe('A mind map summarizing the key concepts in markdown format.'),
  revisionNotes: z
    .string()
    .describe('Detailed revision notes covering the topics discussed in markdown format.'),
  questionsAndAnswers: z
    .string()
    .describe('Relevant questions and answers for self-assessment in markdown format.'),
  keywords: z.string().describe('A list of important keywords and their definitions.'),
  cbseMarkingScheme: z.string().describe('An example marking scheme based on CBSE guidelines for a sample question from the conversation.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are an AI study material generator for Class 10 CBSE curriculum. You take a student's conversation history and their latest prompt to generate personalized, well-organized, and colorful study materials.

  The study materials should directly address the user's latest prompt, using the conversation history for context. Generate the following:
  - A mind map summarizing the key concepts related to the user's prompt (using markdown formatting like nested lists).
  - Detailed revision notes covering the topics in the prompt.
  - Relevant questions and answers for self-assessment based on the prompt.
  - A list of important keywords and their definitions from the prompt's topics.
  - An example marking scheme based on CBSE guidelines for a relevant question from the conversation.

  User's Latest Prompt: {{{prompt}}}
  Conversation History: {{{conversationHistory}}}

  Ensure the generated content is accurate, comprehensive, and tailored to the student's prompt.
  Follow CBSE guidelines and formats where applicable. Provide all output in markdown format.
  Be well-organized and use markdown for clear formatting (headings, lists, bold text).
  `,
});

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const {output} = await prompt(input);
  return output!;
}
