"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, sendEmailVerification, User } from "firebase/auth";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { LoaderCircle } from "lucide-react";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [unverifiedUser, setUnverifiedUser] = React.useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const handleResendVerification = async () => {
    if (unverifiedUser) {
      try {
        await sendEmailVerification(unverifiedUser);
        toast({
          title: "Verification Email Sent",
          description: "A new verification link has been sent to your email address.",
        });
        setUnverifiedUser(null);
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description: "Failed to resend verification email.",
          variant: "destructive",
        });
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUnverifiedUser(null);
    try {
      const userCredential = await signInWithEmailAndPassword(values.email, values.password);
      if (userCredential) {
        if (!userCredential.user.emailVerified && values.email !== "bsadgun2408@gmail.com") {
          setUnverifiedUser(userCredential.user);
          toast({
            title: "Email Not Verified",
            description: "Please verify your email address before logging in.",
            variant: "destructive",
          });
          // Note: react-firebase-hooks automatically signs the user out if there's an error during sign-in process,
          // but if they are technically "signed in" but not verified, we might need to sign them out manually.
          // For now, react-firebase-hooks seems to handle this state.
          return;
        }

        if(values.email === "bsadgun2408@gmail.com") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } else if (error) {
        let errorMessage = "An unknown error occurred.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMessage = "Invalid email or password. Please try again.";
        }
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch(e) {
        console.error(e);
        toast({
          title: "Login Failed",
          description: "An unexpected error occurred during login.",
          variant: "destructive",
        });
    }
  }

  React.useEffect(() => {
    if (error) {
        let errorMessage = "An unknown error occurred.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = "This account has been disabled by an administrator."
        }
        toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
        });
    }
  }, [error, toast]);


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Log In
            </Button>
            {unverifiedUser && (
                <div className="text-center text-sm">
                    <p className="text-destructive">Your email is not verified.</p>
                    <Button variant="link" onClick={handleResendVerification} className="text-primary">
                        Resend verification email
                    </Button>
                </div>
            )}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline text-primary">
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
