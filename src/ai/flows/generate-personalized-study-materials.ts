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
  mindMap: z.string().describe('A mind map summarizing the key concepts.'),
  revisionNotes: z
    .string()
    .describe('Detailed revision notes covering the topics discussed.'),
  questionsAndAnswers: z
    .string()
    .describe('Relevant questions and answers for self-assessment.'),
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
  prompt: `You are an AI study material generator. You take a student's conversation history and generate personalized study materials.

  The study materials should include:
  - A mind map summarizing the key concepts discussed in the conversation.
  - Detailed revision notes covering the topics discussed in the conversation.
  - Relevant questions and answers for self-assessment.

  Consider the student's name when generating the materials to personalize the content.

  Student Name: {{{studentName}}}
  Conversation History: {{{conversationHistory}}}

  Ensure the generated content is accurate, comprehensive, and tailored to the student's learning path.
  Follow CBSE guidelines and formats where applicable.  Provide the output in markdown format.
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
