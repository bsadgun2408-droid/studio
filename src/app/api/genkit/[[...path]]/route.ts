import {createApp} from '@genkit-ai/next';
import {ai} from '@/ai/genkit';
import '@/ai/flows';

export const {GET, POST} = createApp({ai});
