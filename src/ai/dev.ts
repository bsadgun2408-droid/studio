import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-study-materials.ts';
import '@/ai/flows/analyze-uploaded-notes.ts';
import '@/ai/flows/evaluate-student-answers.ts';