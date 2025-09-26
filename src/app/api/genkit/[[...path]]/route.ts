import {defineNextHandler} from '@genkit-ai/next';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { config } from 'dotenv';
import '@/ai/flows';

config();

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'warn',
  traceStore: 'noop',
  flowStore: 'noop',
  model: 'googleai/gemini-2.5-flash',
});


export const {GET, POST} = defineNextHandler({ai});
