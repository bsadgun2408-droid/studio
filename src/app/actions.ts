'use server';
/**
 * @fileOverview This file contains the server-side logic for the AI chat functionality.
 */
import { z } from 'zod';
import { type ChatInput, type ChatOutput, ChatInputSchema, ChatOutputSchema } from './types';


// Simplified function to call Gemini API directly
async function callGemini(input: ChatInput): Promise<any> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable not set. Please add it to your Vercel project settings.");
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const studyMaterialsTool = {
        "name": "generateStudyMaterials",
        "description": "Generates a complete set of study materials for a given topic. Use this for general questions or when a user wants to learn about something.",
        "parameters": {
            "type": "object",
            "properties": {
                "mindMap": { "type": "string", "description": "A mind map summarizing the key concepts in markdown format." },
                "revisionNotes": { "type": "string", "description": "Detailed revision notes covering the topics discussed in markdown format." },
                "questionsAndAnswers": { "type": "string", "description": "Relevant questions and answers for self-assessment in markdown format." },
                "keywords": {
                    "type": "array",
                    "description": "A list of important keywords and their definitions.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "keyword": { "type": "string" },
                            "definition": { "type": "string" }
                        }
                    }
                },
                "cbseMarkingScheme": { "type": "string", "description": "An example marking scheme based on CBSE guidelines." },
                "mnemonics": { "type": "string", "description": "Mnemonics to help remember key concepts." },
                "pyqs": { "type": "string", "description": "Previous Year Questions (PYQs) related to the topic." }
            },
            "required": ["mindMap", "revisionNotes", "questionsAndAnswers", "keywords", "cbseMarkingScheme", "mnemonics", "pyqs"]
        }
    };

    const analyzeNotesTool = {
        "name": "analyzeUploadedNotes",
        "description": "Analyzes the content of an uploaded document or image and answers a question based on that document. Use this ONLY when a user has uploaded a file and is asking a question about it.",
        "parameters": {
            "type": "object",
            "properties": {
                "answer": { "type": "string", "description": "The answer to the question, based *only* on the provided document content." }
            },
            "required": ["answer"]
        }
    };

    const tools = {
        "function_declarations": [studyMaterialsTool, analyzeNotesTool]
    };

    let contents = [
        {
            "role": "user",
            "parts": [
                {
                    "text": `You are an expert AI tutor for the Class 10 CBSE curriculum. Your capabilities are:
1.  **Generate Study Materials:** If the user asks a general question or wants to learn about a topic, you MUST call the 'generateStudyMaterials' function to generate a comprehensive set of study materials.
2.  **Answer from Notes:** If the user has uploaded a document (notes) and asks a question about it, you MUST call the 'analyzeUploadedNotes' function to answer ONLY from the provided document.

**Decision-Making:**
- **IF** a document has been uploaded (indicated by the presence of file data) AND the user's prompt is a question about the document, call the \`analyzeUploadedNotes\` function.
- **ELSE** (for all other prompts), call the \`generateStudyMaterials\` function.

**Conversation History:**
${input.conversationHistory}

**User's Latest Prompt:**
${input.prompt}`
                }
            ]
        }
    ];

    if (input.notesDataUri) {
        const [header, data] = input.notesDataUri.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1];
        if(mimeType && data) {
             contents[0].parts.push({
                "inline_data": {
                    "mime_type": mimeType,
                    "data": data
                }
            });
        }
    }


    const body = {
        contents,
        tools: [tools]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Gemini API request failed:", response.status, errorBody);
            throw new Error(`Gemini API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const toolCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall;

        if (toolCall) {
            return toolCall.args;
        } else {
             // If the model doesn't use a tool and just returns text
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
                // We will format this as a simple answer, which is a valid ChatOutput type
                return { answer: textResponse };
            }
             throw new Error("AI response did not contain a valid tool call or text response.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}


/**
 * This is the main server-action that can be called from client components.
 * It executes the chat flow on the server.
 */
export async function runChatFlow(input: ChatInput): Promise<ChatOutput> {
  // Validate input with Zod schema
  const validatedInput = ChatInputSchema.parse(input);
  
  const output = await callGemini(validatedInput);

  // Validate output with Zod schema before returning
  const validatedOutput = ChatOutputSchema.parse(output);
  
  return validatedOutput;
}
