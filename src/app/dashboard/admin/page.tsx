"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, doc, updateDoc, getFirestore } from "firebase/firestore";
import { useCollection } from "@/firebase";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { LoaderCircle, Ban, CheckCircle, Shield, LogOut, Home } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getAuth, signOut } from "firebase/auth";

type UserData = {
  uid: string;
  name: string;
  email: string;
  isBanned: boolean;
};

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = getFirestore();
  
  const usersCollection = useMemo(() => {
      if (!firestore) return null;
      return collection(firestore, "users")
  }, [firestore]);

  const { data: users, isLoading: usersLoading, error } = useCollection<UserData>(usersCollection as any);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const handleToggleBan = async (uid: string, isBanned: boolean) => {
    if (!firestore) return;
    const userRef = doc(firestore, "users", uid);
    try {
      await updateDoc(userRef, { isBanned: !isBanned });
      toast({
        title: "Success",
        description: `User has been ${!isBanned ? 'banned' : 'unbanned'}.`,
      });
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  if (isUserLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if user is not the admin
  useEffect(() => {
    if (!isUserLoading && (!user || user.email !== "sadgun@gmail.com")) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  if (!user || user.email !== "sadgun@gmail.com") {
      return null;
  }
  
  return (
    <div className="p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </header>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive">Error: {error.message}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action (Ban/Unban)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {u.isBanned ? (
                      <span className="flex items-center text-destructive"><Ban className="mr-2 h-4 w-4" /> Banned</span>
                    ) : (
                      <span className="flex items-center text-green-500"><CheckCircle className="mr-2 h-4 w-4" /> Active</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={u.isBanned}
                      onCheckedChange={() => handleToggleBan(u.uid, u.isBanned)}
                      aria-label={`Ban or unban user ${u.name}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
