
'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MailCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerifyEmailCardProps {
    userEmail: string | null;
    onResend: () => Promise<void>;
}

export function VerifyEmailCard({ userEmail, onResend }: VerifyEmailCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleResendClick = async () => {
        setIsLoading(true);
        try {
            await onResend();
            toast({
                title: "Verification Email Sent",
                description: `A new verification link has been sent to ${userEmail}. Please check your inbox and spam folder.`,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Failed to send verification email. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-20">
            <Card>
                <CardHeader className="items-center text-center">
                    <MailCheck className="h-16 w-16 text-primary mb-4"/>
                    <CardTitle className="text-2xl font-headline">Please Verify Your Email</CardTitle>
                    <CardDescription>
                        A verification link has been sent to <strong>{userEmail}</strong>. Please check your inbox to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground text-sm">
                        You need to verify your email address before you can generate images. Once verified, please refresh this page.
                    </p>
                    <Button onClick={handleResendClick} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        ) : null}
                        Resend Verification Email
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
