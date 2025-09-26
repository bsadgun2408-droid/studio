import {defineNextHandler} from '@genkit-ai/next';
import {ai} from '@/ai/genkit';
import '@/ai/flows';

export const {GET, POST} = defineNextHandler({ai});
