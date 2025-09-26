
'use server';

/**
 * @fileOverview This flow analyzes student-uploaded notes and answers questions based on the content.
 *
 * - analyzeUploadedNotes - A function that handles the analysis of uploaded notes and answers questions.
 * - AnalyzeUploadedNotesInput - The input type for the analyzeUploadedNotes function.
 * - AnalyzeUploadedNotesOutput - The return type for the analyzeUploadedNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedNotesInputSchema = z.object({
  notesDataUri: z
    .string()
    .describe(
      "The uploaded notes or image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the uploaded content.'),
});
export type AnalyzeUploadedNotesInput = z.infer<typeof AnalyzeUploadedNotesInputSchema>;

const AnalyzeUploadedNotesOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the uploaded content.'),
});
export type AnalyzeUploadedNotesOutput = z.infer<typeof AnalyzeUploadedNotesOutputSchema>;

export async function analyzeUploadedNotes(
  input: AnalyzeUploadedNotesInput
): Promise<AnalyzeUploadedNotesOutput> {
  return analyzeUploadedNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUploadedNotesPrompt',
  input: {schema: AnalyzeUploadedNotesInputSchema},
  output: {schema: AnalyzeUploadedNotesOutputSchema},
  prompt: `You are an expert AI tutor specialized in the Class 10 CBSE curriculum and general education topics.

You will analyze the content of the uploaded document or image and answer the question based on the information provided.

Uploaded Content: {{media url=notesDataUri}}

Question: {{{question}}}

Answer the question based *only* on the provided content.`,
});

const analyzeUploadedNotesFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedNotesFlow',
    inputSchema: AnalyzeUploadedNotesInputSchema,
    outputSchema: AnalyzeUploadedNotesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
