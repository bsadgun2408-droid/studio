import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {nextPlugin} from '@genkit-ai/next';
import { config } from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    googleAI(),
    nextPlugin(),
  ],
  logLevel: 'warn',
  traceStore: 'noop',
  flowStore: 'noop',
  model: 'googleai/gemini-2.5-flash',
});
