"use client";

import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, LoaderCircle, Send } from "lucide-react";

import { analyzeUploadedNotes, type AnalyzeUploadedNotesOutput } from "@/ai/flows/analyze-uploaded-notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  question: z.string().min(5, {
    message: "Please ask a clear question.",
  }),
});

export default function AnalyzeNotesPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeUploadedNotesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notesDataUri, setNotesDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNotesDataUri(e.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!notesDataUri) {
      toast({
        title: "No file uploaded",
        description: "Please upload your notes before asking a question.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeUploadedNotes({
        notesDataUri,
        question: values.question,
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error analyzing notes:", error);
      toast({
        title: "Error",
        description: "Failed to analyze your notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Analyze Your Notes</CardTitle>
          <CardDescription>Upload your study materials (e.g., PDF, image of notes) and ask any question about the content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notes-upload">Upload Notes</Label>
            <div className="relative">
                <Input id="notes-upload" type="file" className="pl-12" onChange={handleFileChange} />
                <FileUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            {fileName && <p className="text-sm text-muted-foreground">Uploaded: {fileName}</p>}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., What are the main themes in Chapter 3?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || !notesDataUri} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Ask Question
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
          <p className="ml-4 text-lg">Analyzing and finding an answer...</p>
        </div>
      )}

      {analysisResult && (
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{analysisResult.answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
