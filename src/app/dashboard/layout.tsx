import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="flex flex-col h-screen">
        {children}
      </div>
    </FirebaseClientProvider>
  );
}
