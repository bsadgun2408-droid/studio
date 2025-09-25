import { ArrowRight, MessageSquare, FileText, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {PlaceHolderImages} from "@/lib/placeholder-images";

const features = [
  {
    title: "AI Tutor",
    description: "Get instant help and step-by-step explanations.",
    icon: MessageSquare,
    href: "/dashboard/chat",
    cta: "Start Chatting",
  },
  {
    title: "Analyze Your Notes",
    description: "Upload your notes and ask questions.",
    icon: FileText,
    href: "/dashboard/analyze-notes",
    cta: "Analyze Now",
  },
  {
    title: "Generate Study Materials",
    description: "Create personalized study guides and mind maps.",
    icon: BookOpen,
    href: "/dashboard/study-materials",
    cta: "Generate Now",
  },
];

export default function DashboardPage() {
    const welcomeImage = PlaceHolderImages.find(p => p.id === 'dashboard-welcome');
  return (
    <div className="flex flex-col gap-8">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
        {welcomeImage && (
            <Image
                src={welcomeImage.imageUrl}
                alt={welcomeImage.description}
                fill
                className="object-cover"
                data-ai-hint={welcomeImage.imageHint}
            />
        )}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-transparent"></div>
        </div>
        <CardHeader className="relative">
          <h1 className="text-3xl font-bold font-headline text-primary">
            Welcome, Student!
          </h1>
          <CardDescription className="text-lg text-foreground/80">
            Ready to dive into your studies? Let&apos;s get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/dashboard/chat">
              Start a New Session <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
              <feature.icon className="w-8 h-8 text-accent" />
              <div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild variant="outline" className="w-full">
                <Link href={feature.href}>
                  {feature.cta}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
