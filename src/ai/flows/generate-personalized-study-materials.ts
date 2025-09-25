
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized study materials based on a student's learning path.
 *
 * The flow takes the student's conversation history as input and generates tailored study materials including mind maps and revision notes.
 * - generatePersonalizedStudyMaterials - A function that handles the generation of personalized study materials.
 * - GeneratePersonalizedStudyMaterialsInput - The input type for the generatePersonalizedStudyMaterials function.
 * - GeneratePersonalizedStudyMaterialsOutput - The return type for the generatePersonalizedStudyMaterials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedStudyMaterialsInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe(
      'The complete conversation history between the student and the AI tutor.'
    ),
  studentName: z.string().describe('The name of the student.'),
});
export type GeneratePersonalizedStudyMaterialsInput = z.infer<
  typeof GeneratePersonalizedStudyMaterialsInputSchema
>;

const GeneratePersonalizedStudyMaterialsOutputSchema = z.object({
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
export type GeneratePersonalizedStudyMaterialsOutput = z.infer<
  typeof GeneratePersonalizedStudyMaterialsOutputSchema
>;

export async function generatePersonalizedStudyMaterials(
  input: GeneratePersonalizedStudyMaterialsInput
): Promise<GeneratePersonalizedStudyMaterialsOutput> {
  return generatePersonalizedStudyMaterialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedStudyMaterialsPrompt',
  input: {schema: GeneratePersonalizedStudyMaterialsInputSchema},
  output: {schema: GeneratePersonalizedStudyMaterialsOutputSchema},
  prompt: `You are an AI study material generator for Class 10 CBSE curriculum. You take a student's conversation history and generate personalized, well-organized, and colorful study materials.

  The study materials should include:
  - A mind map summarizing the key concepts discussed in the conversation (using markdown formatting like nested lists).
  - Detailed revision notes covering the topics discussed.
  - Relevant questions and answers for self-assessment.
  - A list of important keywords and their definitions.
  - An example marking scheme based on CBSE guidelines for a relevant question from the conversation.

  Consider the student's name when generating the materials to personalize the content.

  Student Name: {{{studentName}}}
  Conversation History: {{{conversationHistory}}}

  Ensure the generated content is accurate, comprehensive, and tailored to the student's learning path.
  Follow CBSE guidelines and formats where applicable.  Provide all output in markdown format.
  Be well-organized and use markdown for clear formatting (headings, lists, bold text).
  `,
});

const generatePersonalizedStudyMaterialsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyMaterialsFlow',
    inputSchema: GeneratePersonalizedStudyMaterialsInputSchema,
    outputSchema: GeneratePersonalizedStudyMaterialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    