"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, Send, LoaderCircle, Download, Menu, History, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { chat } from "@/ai/flows/chat";

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const formSchema = z.object({
  prompt: z.string().min(1),
});

export default function DashboardPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
      { sender: 'ai', text: 'Hello! I am EduVault AI. How can I help you today?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { sender: 'user', text: values.prompt };
    setMessages(prev => [...prev, userMessage]);
    form.reset();

    try {
      const aiResponse = await chat({ prompt: values.prompt });
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse.response }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble responding right now." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
            <BookOpenCheck className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold font-headline">EduVault AI</h1>
        </div>

        <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/history')}>
                <History className="mr-2 h-4 w-4" />
                History
            </Button>
            <Button variant="outline" size="sm" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download Notes
            </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">AI</div>}
            <Card className={`max-w-xl ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
              <CardContent className="p-3">
                <p>{msg.text}</p>
              </CardContent>
            </Card>
             {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent-foreground text-sm">U</div>}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">AI</div>
                <Card className="max-w-xl">
                    <CardContent className="p-3 flex items-center gap-2">
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                        <span>Thinking...</span>
                    </CardContent>
                </Card>
            </div>
        )}
      </main>

      <footer className="p-4 border-t bg-background">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <Button variant="ghost" size="icon" type="button" disabled>
                <Paperclip />
            </Button>
            <Input 
                autoComplete="off"
                placeholder="Ask me anything..." 
                {...form.register('prompt')}
                disabled={isLoading}
            />
            <Button variant="default" size="icon" type="submit" disabled={isLoading}>
              <Send />
            </Button>
          </form>
        </FormProvider>
      </footer>
    </div>
  );
}
