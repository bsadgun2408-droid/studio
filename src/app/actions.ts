'use server';

import { chatFlow } from '@/ai/flows/chat';
import type { ChatInput } from '@/ai/flows/types';

/**
 * This is a server-action that can be called from client components.
 * It executes the chatFlow on the server.
 */
export async function runChatFlow(input: ChatInput) {
  const output = await chatFlow(input);
  return output;
}
