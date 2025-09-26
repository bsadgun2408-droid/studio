/**
 * @fileoverview This file exports all the Genkit flows.
 */

import {
  analyzeUploadedNotesFlow,
  AnalyzeUploadedNotesInputSchema,
  AnalyzeUploadedNotesOutputSchema,
} from './analyze-uploaded-notes';
import { chatFlow, ChatInputSchema, ChatOutputSchema } from './chat';

export {
  analyzeUploadedNotesFlow,
  chatFlow,
  AnalyzeUploadedNotesInputSchema,
  AnalyzeUploadedNotesOutputSchema,
  ChatInputSchema,
  ChatOutputSchema,
};
