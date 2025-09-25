"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerDownLeft, LoaderCircle, Star } from "lucide-react";

import { evaluateStudentAnswer, type EvaluateStudentAnswerOutput } from "@/ai/flows/evaluate-student-answers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  studentAnswer: z.string().min(10, {
    message: "Please provide a more detailed answer.",
  }),
});

// Mock data for the flow
const questionData = {
    question: "Explain the process of photosynthesis and its importance for life on Earth. Include the chemical equation.",
    correctAnswer: "Photosynthesis is the process used by plants, algae, and some bacteria to convert light energy into chemical energy, through a process that converts carbon dioxide and water into glucose (sugar) and oxygen. The chemical equation is 6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2. It is vital for life as it produces oxygen, which most organisms need for respiration, and is the primary source of organic matter for most of Earth's ecosystems.",
    markingGuidelines: "3 Marks: 1 mark for the correct definition of photosynthesis. 1 mark for the balanced chemical equation. 1 mark for explaining its importance (production of oxygen and food source)."
}

export default function ChatPage() {
  const [evaluationResult, setEvaluationResult] = useState<EvaluateStudentAnswerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { studentAnswer: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setEvaluationResult(null);
    try {
      const result = await evaluateStudentAnswer({
        ...questionData,
        studentAnswer: values.studentAnswer,
      });
      setEvaluationResult(result);
    } catch (error) {
      console.error("Error evaluating answer:", error);
      toast({
        title: "Error",
        description: "Failed to get evaluation. Please try again.",
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
          <CardTitle className="font-headline text-2xl">Practice Question</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{questionData.question}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Your Answer</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="studentAnswer"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="sr-only">Your Answer</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Type your detailed answer here..."
                        className="min-h-[150px] text-base"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        {isLoading ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                        <CornerDownLeft className="mr-2 h-4 w-4" />
                        )}
                        Submit for Evaluation
                    </Button>
                </div>
            </form>
            </Form>
        </CardContent>
      </Card>


      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
          <p className="ml-4 text-lg">Evaluating your answer...</p>
        </div>
      )}

      {evaluationResult && (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{evaluationResult.evaluation}</p>
            </CardContent>
             <CardFooter className="flex items-center gap-2 text-lg font-bold text-accent">
                <Star className="h-5 w-5 fill-current" />
                <span>Marks Awarded: {evaluationResult.marksAwarded}</span>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Feedback</CardTitle>
              <CardDescription>Here are some suggestions to improve your answer.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{evaluationResult.feedback}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
