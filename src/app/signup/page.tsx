import Image from 'next/image';
import { SignupForm } from '@/components/signup-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SignupPage() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'login-hero');
  return (
    <main className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline sm:text-4xl">
            Create an Account
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join EduVault AI and start your personalized learning journey.
          </p>
          <div className="mt-8">
            <SignupForm />
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
