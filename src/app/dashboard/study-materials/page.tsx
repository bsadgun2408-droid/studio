"use client";

import { useState } from "react";
import { BookMarked, BrainCircuit, FileQuestion, LoaderCircle, Sparkles } from "lucide-react";

import { generatePersonalizedStudyMaterials, type GeneratePersonalizedStudyMaterialsOutput } from "@/ai/flows/generate-personalized-study-materials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock data for the flow
const mockData = {
  studentName: "Alex",
  conversationHistory: `
    Tutor: Hi Alex! Today, let's discuss the key events of the Indian Rebellion of 1857. What do you know about its causes?
    Alex: I think it was about the new rifle cartridges greased with animal fat, right?
    Tutor: That's a great start! The greased cartridges were indeed the immediate trigger, offending both Hindu and Muslim sepoys. But there were deeper, long-term causes too. Can you think of any political or economic reasons?
    Alex: Hmm, maybe something about the British taking over kingdoms?
    Tutor: Exactly! The 'Doctrine of Lapse' was a policy where the British annexed states without a natural heir. This caused a lot of resentment among Indian rulers. Economically, heavy taxes and the destruction of local industries also made people very unhappy.
    Alex: I see. So it wasn't just one thing.
    Tutor: Precisely. It was a combination of social, religious, political, and economic grievances. Now, let's talk about some of the key figures in the rebellion. Have you heard of Mangal Pandey?
    Alex: Yes, he was a sepoy who attacked British officers.
    Tutor: Correct. His actions in Barrackpore are often seen as the starting point of the open rebellion. Other important leaders included Rani Lakshmibai of Jhansi and Bahadur Shah Zafar, the last Mughal emperor.
  `,
};

export default function StudyMaterialsPage() {
  const [studyMaterials, setStudyMaterials] = useState<GeneratePersonalizedStudyMaterialsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleGenerate() {
    setIsLoading(true);
    setStudyMaterials(null);
    try {
      const result = await generatePersonalizedStudyMaterials(mockData);
      setStudyMaterials(result);
    } catch (error) {
      console.error("Error generating study materials:", error);
      toast({
        title: "Error",
        description: "Failed to generate materials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Generate Study Materials</CardTitle>
          <CardDescription>
            Based on your conversation history, the AI can generate a personalized study guide, including a mind map, revision notes, and practice questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerate} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate My Study Guide
          </Button>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
          <p className="ml-4 text-lg">Creating your personalized materials...</p>
        </div>
      )}

      {studyMaterials && (
        <Tabs defaultValue="mind-map" className="animate-in fade-in-50 duration-500">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mind-map"><BrainCircuit className="mr-2" />Mind Map</TabsTrigger>
            <TabsTrigger value="revision-notes"><BookMarked className="mr-2" />Revision Notes</TabsTrigger>
            <TabsTrigger value="questions"><FileQuestion className="mr-2" />Q&A</TabsTrigger>
          </TabsList>
          <TabsContent value="mind-map">
            <Card>
                <CardHeader><CardTitle className="font-headline text-primary">Mind Map</CardTitle></CardHeader>
                <CardContent><pre className="whitespace-pre-wrap font-sans text-sm">{studyMaterials.mindMap}</pre></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="revision-notes">
            <Card>
                <CardHeader><CardTitle className="font-headline text-primary">Revision Notes</CardTitle></CardHeader>
                <CardContent><pre className="whitespace-pre-wrap font-sans text-sm">{studyMaterials.revisionNotes}</pre></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="questions">
            <Card>
                <CardHeader><CardTitle className="font-headline text-primary">Questions & Answers</CardTitle></CardHeader>
                <CardContent><pre className="whitespace-pre-wrap font-sans text-sm">{studyMaterials.questionsAndAnswers}</pre></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
