'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Bot } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setAuthModalOpen(false);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      // Here you could use a toast to show an error to the user
    }
  };

  const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-65.7 64.9C337 101.6 296.2 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 406.5 248 406.5c95.7 0 131.3-75.3 135-112.2H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
  );

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <Bot className="h-12 w-12 text-primary mb-2" />
          <DialogTitle className="text-2xl font-headline">Join VisionHub AI</DialogTitle>
          <DialogDescription>
            Sign in to start creating and managing your AI-generated art.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Button onClick={handleGoogleSignIn} className="w-full">
            <GoogleIcon />
            Continue with Google
          </Button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
