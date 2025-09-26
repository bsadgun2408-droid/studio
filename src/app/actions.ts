'use server';
/**
 * @fileOverview This file contains the server-side logic for the AI chat functionality.
 */

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';

config();

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'warn',
  traceStore: 'noop',
  flowStore: 'noop',
});


// Define the Zod schema for the chat input
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


// Define the Zod schemas for the chat output
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

export const ChatOutputSchema = z.union([StudyMaterialsSchema, SimpleAnswerSchema]);
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


// Tool to analyze uploaded notes. The AI will decide when to use this.
const analyzeNotesTool = ai.defineTool(
  {
    name: 'analyzeUploadedNotes',
    description: 'Use this tool when the user has uploaded a file and is asking a question about it. This tool analyzes the content of an uploaded document or image and answers a question based on the information provided within that document.',
    inputSchema: z.object({
        question: z.string().describe("The user's question about the document."),
    }),
    outputSchema: z.object({
        answer: z.string().describe('The answer to the question, based *only* on the provided document content.'),
    }),
  },
  async (input) => {
    // For this tool, the main prompt already has access to the file if provided,
    // so we can just structure the response. The important part is that the LLM
    // decided to use this tool, which means we should return a simple answer.
    return { answer: `Answer based on notes about: ${input.question}` };
  }
);


const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  tools: [analyzeNotesTool],
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert AI tutor for the Class 10 CBSE curriculum. Your capabilities are:
1.  **Generate Study Materials:** If the user asks a general question or wants to learn about a topic, you MUST generate a comprehensive set of study materials.
2.  **Answer from Notes:** If the user has uploaded a document (notes) and asks a question about it, you MUST use the 'analyzeUploadedNotes' tool to answer ONLY from the provided document. When using the tool, provide just the answer without any extra study materials.

**Decision-Making:**
- **IF** a document has been uploaded (indicated by the presence of 'notesDataUri') AND the user's prompt is a question about the document, call the \`analyzeUploadedNotes\` tool.
- **ELSE** (for all other prompts), generate a full set of personalized study materials based on their prompt and conversation history.

**Study Material Generation Rules (only when not using the tool):**
- Generate a mind map (markdown nested lists).
- Detailed revision notes.
- Q&A for self-assessment.
- Important keywords and definitions (as an array of objects).
- An example CBSE marking scheme.
- Mnemonics.
- Previous Year Questions (PYQs).
- All output MUST be in well-organized markdown.

{{#if notesDataUri}}
**Uploaded Content to Analyze (if you decide to use the tool):**
{{media url=notesDataUri}}
{{/if}}

**Conversation History:**
{{{conversationHistory}}}

**User's Latest Prompt:**
{{{prompt}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const response = await chatPrompt(input);
    
    // If output exists, the model has generated the structured data directly.
    if (response.output) {
      return response.output;
    }

    // If output doesn't exist, the model has decided to use a tool.
    const toolChoice = response.choices.find(c => c.toolRequest);
    if (toolChoice) {
      const toolResponse = await toolChoice.generate();
      return toolResponse.output as ChatOutput;
    }
    
    // Fallback if something unexpected happens.
    throw new Error("Unexpected response from AI model.");
  }
);


/**
 * This is the main server-action that can be called from client components.
 * It executes the chatFlow on the server.
 */
export async function runChatFlow(input: ChatInput): Promise<ChatOutput> {
  const output = await chatFlow(input);
  return output;
}
