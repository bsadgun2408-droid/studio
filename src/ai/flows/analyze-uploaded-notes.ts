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
      "The uploaded notes as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the uploaded notes.'),
});
export type AnalyzeUploadedNotesInput = z.infer<typeof AnalyzeUploadedNotesInputSchema>;

const AnalyzeUploadedNotesOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the uploaded notes.'),
});
export type AnalyzeUploadedNotesOutput = z.infer<typeof AnalyzeUploadedNotesOutputSchema>;

export async function analyzeUploadedNotes(
  input: AnalyzeUploadedNotesInput
): Promise<AnalyzeUploadedNotesOutput> {
  const prompt = ai.definePrompt({
    name: 'analyzeUploadedNotesPrompt',
    input: {schema: AnalyzeUploadedNotesInputSchema},
    output: {schema: AnalyzeUploadedNotesOutputSchema},
    prompt: `You are an expert AI tutor specialized in the Class 10 CBSE curriculum and general education topics.

You will analyze the content of the uploaded notes and answer the question based on the information provided in the notes.

Uploaded Notes: {{media url=notesDataUri}}

Question: {{{question}}}

Answer: `,
  });

  const llmResponse = await ai.generate({
    prompt: [
        {text: `You are an expert AI tutor specialized in the Class 10 CBSE curriculum and general education topics.

You will analyze the content of the uploaded notes and answer the question based on the information provided in the notes.

Question: ${input.question}

Answer: `},
        {media: {url: input.notesDataUri}}
    ],
    model: 'googleai/gemini-2.5-flash',
    output: {
        schema: AnalyzeUploadedNotesOutputSchema
    }
  });

  return llmResponse.output()!;
}
