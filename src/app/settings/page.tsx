'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, User, Palette, Shield } from 'lucide-react';
import { UpdatePasswordModal } from '@/components/update-password-modal';

// export const metadata: Metadata = { // Metadata must be defined in a server component
//   title: 'Settings | VisionHub AI',
//   description: 'Manage your account settings.',
// };

export default function SettingsPage() {
  const { user } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  if (!user) {
    return (
       <div className="flex h-full items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <UpdatePasswordModal isOpen={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
            Creator Hub
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Manage your VisionHub profile, security, and preferences.
          </p>
        </div>

        <div className="flex items-center gap-6 mb-12 bg-card p-6 rounded-lg">
          <Avatar className="h-24 w-24 border-4 border-primary/50">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback className="text-4xl">
                {user.displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold font-headline">{user.displayName}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Profile Information</CardTitle>
                    <CardDescription>View and manage your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Full Name</span>
                        <span>{user.displayName}</span>
                    </div>
                     <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Email Address</span>
                        <span>{user.email}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield /> Security</CardTitle>
                    <CardDescription>Update your password and manage account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Password</p>
                        <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
                            <KeyRound className="mr-2 h-4 w-4"/>
                            Change Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette /> Creator Preferences</CardTitle>
                    <CardDescription>Customize your image generation experience.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">
                        More customization options coming soon!
                     </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
