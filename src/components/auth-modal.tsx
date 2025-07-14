
'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { Bot, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-65.7 64.9C337 101.6 296.2 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 406.5 248 406.5c95.7 0 131.3-75.3 135-112.2H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
  </svg>
);

export function AuthModal() {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    signInWithGoogle,
    signInWithEmail,
    sendPasswordReset
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      setAuthModalOpen(false);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      setAuthModalOpen(false);
    } catch (error) {
      console.error('Email Sign-In Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordReset(email);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox for instructions to reset your password.",
      });
      setAuthModalOpen(false);
    } catch (error) {
       setError(error instanceof Error ? error.message : 'Failed to send password reset email.');
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <Bot className="h-12 w-12 text-primary mb-2" />
          <DialogTitle className="text-2xl font-headline">Welcome Back</DialogTitle>
          <DialogDescription>
            Sign in to continue your creative journey.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Sign in with Google</TabsTrigger>
            <TabsTrigger value="password">Use Password</TabsTrigger>
          </TabsList>
          <TabsContent value="google" className="py-4">
             <Button onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground mt-4">
              First time? Sign in with Google to create your account.
            </p>
          </TabsContent>
          <TabsContent value="password">
            <form onSubmit={handleEmailSignIn} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="creator@visionhub.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                 <div className="text-right">
                    <Button type="button" variant="link" className="p-0 h-auto text-xs" onClick={handlePasswordReset} disabled={isLoading}>
                        Forgot Password?
                    </Button>
                 </div>
                {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>

      </DialogContent>
    </Dialog>
  );
}
