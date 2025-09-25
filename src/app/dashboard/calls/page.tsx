import { Video, Mic } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CallsPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-accent/20 rounded-full p-3 w-fit">
            <Video className="w-10 h-10 text-accent" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">
            Instant Doubt-Solving Calls
          </CardTitle>
          <CardDescription>
            This feature is coming soon! Get ready to connect with our AI tutor through voice or video for real-time help.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button disabled variant="outline">
            <Mic className="mr-2 h-4 w-4" /> Start Voice Call
          </Button>
          <Button disabled>
            <Video className="mr-2 h-4 w-4" /> Start Video Call
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
