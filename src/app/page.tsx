import Image from 'next/image';
import { LoginForm } from '@/components/login-form';
import {PlaceHolderImages} from '@/lib/placeholder-images';
import { BookOpenCheck } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'login-hero');
  return (
    <main className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BookOpenCheck className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline sm:text-4xl">
              EduVault AI
            </h1>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            Your personal AI tutor for CBSE Class 10.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            width={1200}
            height={1800}
            className="object-cover w-full h-screen"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
      </div>
    </main>
  );
}
