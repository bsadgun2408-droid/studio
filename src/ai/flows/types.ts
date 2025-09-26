
import {z} from 'genkit';

export const ChatInputSchema = z.object({
  prompt: z.string().describe("The user's prompt or question."),
  conversationHistory: z
    .string()
    .describe(
      'The preceding conversation history between the student and the AI tutor.'
    ),
  notesDataUri: z.string().optional().describe(
    "An optional uploaded file as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


const StudyMaterialsSchema = z.object({
    mindMap: z.string().describe('A mind map summarizing the key concepts in markdown format.'),
    revisionNotes: z
        .string()
        .describe('Detailed revision notes covering the topics discussed in markdown format.'),
    questionsAndAnswers: z
        .string()

        .describe('Relevant questions and answers for self-assessment in markdown format.'),
    keywords: z.array(z.object({
        keyword: z.string().describe("The keyword to be defined."),
        definition: z.string().describe("The definition of the keyword."),
    })).describe('A list of important keywords and their definitions.'),
    cbseMarkingScheme: z.string().describe('An example marking scheme based on CBSE guidelines for a sample question from the conversation.'),
    mnemonics: z.string().describe('Mnemonics to help remember key concepts.'),
    pyqs: z.string().describe('Previous Year Questions (PYQs) related to the topic.'),
});

const SimpleAnswerSchema = z.object({
    answer: z.string().describe("A direct answer to the user's question, used when study materials are not appropriate, such as when answering a question about an uploaded file."),
});

// The output can be one of two types.
export const ChatOutputSchema = z.union([StudyMaterialsSchema, SimpleAnswerSchema]);
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
