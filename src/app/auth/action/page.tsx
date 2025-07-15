
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, KeyRound, Loader2, MailCheck } from 'lucide-react';
import { verifyEmail, confirmPasswordReset } from '@/lib/firebase-actions';
import Link from 'next/link';

// Define schemas
const passwordResetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Main Component
function AuthActionManager() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm({
    initialValues: { password: '', confirmPassword: '' },
    validate: zodResolver(passwordResetSchema),
  });
  
  // Handle Email Verification
  if (mode === 'verifyEmail') {
    const handleVerifyEmail = async () => {
        if (!oobCode) {
            setError('Invalid verification link. Please try again.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await verifyEmail(oobCode);
            setSuccess('Your email has been verified successfully! You can now close this tab and sign in.');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <MailCheck className="mx-auto h-12 w-12 text-primary" />
                <CardTitle>Verify Your Email</CardTitle>
                <CardDescription>Click the button below to complete your account verification.</CardDescription>
            </CardHeader>
            <CardContent>
                {success && <p className="text-center text-green-500 mb-4">{success}</p>}
                {error && <p className="text-center text-destructive mb-4">{error}</p>}
                {!success && (
                    <Button onClick={handleVerifyEmail} disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify Email Address
                    </Button>
                )}
                 {success && (
                    <Button asChild className="w-full">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
  }

  // Handle Password Reset
  if (mode === 'resetPassword') {
    const handleResetPassword = async (values: z.infer<typeof passwordResetSchema>) => {
        if (!oobCode) {
            setError('Invalid password reset link. Please request a new one.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await confirmPasswordReset(oobCode, values.password);
            setSuccess('Your password has been reset successfully. You can now log in with your new password.');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="w-full max-w-md text-center">
                 <CardHeader>
                    <CardTitle>Password Reset Successful!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-green-500 mb-4">{success}</p>
                    <Button asChild className="w-full">
                        <Link href="/">Back to Sign In</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <KeyRound className="mx-auto h-12 w-12 text-primary" />
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>Enter a new password for your account below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.onSubmit(handleResetPassword)} className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input id="password" type="password" {...form.getInputProps('password')} />
                         {form.errors.password && <p className="text-sm text-destructive">{form.errors.password}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" {...form.getInputProps('confirmPassword')} />
                         {form.errors.confirmPassword && <p className="text-sm text-destructive">{form.errors.confirmPassword}</p>}
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <Bot className="mx-auto h-12 w-12 text-primary" />
            <CardTitle>Invalid Action</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground">The link you followed is either invalid or has expired. Please try the action again.</p>
        </CardContent>
    </Card>
  );
}

export default function AuthActionPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
           <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-8">
                <Bot className="h-8 w-8 text-primary" />
                <span>VisionHub AI</span>
           </Link>
           <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin" />}>
               <AuthActionManager />
           </Suspense>
        </div>
    )
}
