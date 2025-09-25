"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, Send, LoaderCircle, Download, Menu, History, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

// Dummy chat and AI response state
const ChatHistory = [
    { sender: 'ai', text: 'Hello! I am EduVault AI. How can I help you today?' },
];

const formSchema = z.object({
  prompt: z.string().min(1),
});

export default function DashboardPage() {
  const router = useRouter();
  const [messages, setMessages] = useState(ChatHistory);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text: values.prompt }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: `This is a simulated response to: "${values.prompt}"` }]);
      setIsLoading(false);
      form.reset();
    }, 1500);
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => router.push('/history')}>
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download Notes
            </Button>
             <Button variant="secondary" size="sm" disabled>
                AI Features
            </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative">
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="text-center text-muted-foreground/10">
                <BookOpenCheck className="w-32 h-32 mx-auto" />
                <h1 className="text-5xl font-bold font-headline">EduVault AI</h1>
            </div>
        </div>
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
