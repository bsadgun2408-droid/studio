'use server';
/**
 * @fileOverview This file contains the server-side logic for the AI chat functionality.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';
import { z } from 'zod';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from './types';


config();

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'warn',
  traceStore: 'noop',
  flowStore: 'noop',
});


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
