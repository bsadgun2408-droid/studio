'use server';

/**
 * @fileOverview This file defines a Genkit flow for evaluating student answers based on correctness and reasoning,
 * providing constructive feedback aligned with CBSE marking guidelines.
 *
 * - evaluateStudentAnswer - A function that evaluates the student's answer and provides feedback.
 * - EvaluateStudentAnswerInput - The input type for the evaluateStudentAnswer function.
 * - EvaluateStudentAnswerOutput - The return type for the evaluateStudentAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateStudentAnswerInputSchema = z.object({
  question: z.string().describe('The question asked to the student.'),
  studentAnswer: z.string().describe('The student\'s answer to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  markingGuidelines: z
    .string()
    .describe('The CBSE marking guidelines for the question.'),
});

export type EvaluateStudentAnswerInput = z.infer<
  typeof EvaluateStudentAnswerInputSchema
>;

const EvaluateStudentAnswerOutputSchema = z.object({
  evaluation: z.string().describe('The evaluation of the student\'s answer.'),
  feedback: z.string().describe('Constructive feedback for the student.'),
  marksAwarded: z.number().describe('Marks awarded based on CBSE guidelines.'),
});

export type EvaluateStudentAnswerOutput = z.infer<
  typeof EvaluateStudentAnswerOutputSchema
>;

export async function evaluateStudentAnswer(
  input: EvaluateStudentAnswerInput
): Promise<EvaluateStudentAnswerOutput> {
  return evaluateStudentAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateStudentAnswerPrompt',
  input: {schema: EvaluateStudentAnswerInputSchema},
  output: {schema: EvaluateStudentAnswerOutputSchema},
  prompt: `You are an expert teacher evaluating student answers based on CBSE marking guidelines.

  Question: {{{question}}}
  Student's Answer: {{{studentAnswer}}}
  Correct Answer: {{{correctAnswer}}}
  Marking Guidelines: {{{markingGuidelines}}}

  Evaluate the student's answer based on the correctness and reasoning, providing constructive feedback aligned with the provided CBSE marking guidelines.
  Determine the marks to be awarded.

  Evaluation: 
  Feedback:
  Marks Awarded:`, // Explicitly specify that it should output those fields
});

const evaluateStudentAnswerFlow = ai.defineFlow(
  {
    name: 'evaluateStudentAnswerFlow',
    inputSchema: EvaluateStudentAnswerInputSchema,
    outputSchema: EvaluateStudentAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
