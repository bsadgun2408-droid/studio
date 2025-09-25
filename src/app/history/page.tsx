import { History } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
            <History className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">
            Chat History
          </CardTitle>
          <CardDescription>
            This feature is coming soon. You&apos;ll be able to review all your past conversations and study sessions right here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
           <div className="p-4 text-left text-sm text-muted-foreground bg-muted/50 rounded-lg">
            <p className="font-bold">Coming Soon:</p>
            <ul className="mt-2 list-disc list-inside">
                <li>Search through past chats.</li>
                <li>Filter by subject or date.</li>
                <li>Revisit generated study materials.</li>
            </ul>
           </div>
        </CardContent>
      </Card>
      <Button asChild variant="link" className="mt-4">
        <Link href="/">Back to Chat</Link>
      </Button>
    </div>
  );
}
