
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, User, Palette, Shield, CreditCard } from 'lucide-react';
import { UpdatePasswordModal } from '@/components/update-password-modal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// export const metadata: Metadata = { // Metadata must be defined in a server component
//   title: 'Settings | VisionHub AI',
//   description: 'Manage your account settings.',
// };

const GooglePayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
      <path d="M6 12l2 -2" />
      <path d="M8 12l2 2" />
      <path d="M12 8l2 2" />
      <path d="M12 14l2 -2" />
      <path d="M14 12l2 -2" />
      <path d="M16 12l2 2" />
    </svg>
);

const SettingsCard = ({ className, children, ...props }: React.ComponentProps<typeof Card>) => (
    <Card className={cn("relative overflow-hidden", className)} {...props}>
        <div
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/visionhub-ai-s813r.firebasestorage.app/o/generated-images%2F6e8b8d45-91cc-4c58-afa3-0794a536b89d.png?alt=media')" }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative">
            {children}
        </div>
    </Card>
);


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

        <div className="flex items-center gap-6 mb-12 bg-card p-6 rounded-lg relative overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/021/171/659/large_2x/colorful-abstract-wallpaper-modern-background-ai-generated-free-photo.jpg')" }}
            />
            <div className="absolute inset-0 bg-background/60" />
            <div className="relative flex items-center gap-6">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SettingsCard>
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
            </SettingsCard>

            <SettingsCard>
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
            </SettingsCard>

            <SettingsCard className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard /> Payment & Billing</CardTitle>
                    <CardDescription>Manage your payment methods and view your billing history. This is a visual placeholder and is not functional.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Add Payment Method</AccordionTrigger>
                            <AccordionContent className="space-y-6 pt-4">
                                <Button variant="outline" className="w-full justify-start text-lg p-6">
                                    <GooglePayIcon /> Link Google Pay
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                        Or add a card
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <Input id="card-number" placeholder="•••• •••• •••• ••••" disabled />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Expires</Label>
                                            <Input id="expiry" placeholder="MM / YY" disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="•••" disabled />
                                        </div>
                                    </div>
                                    <Button className="w-full" disabled>Save Card</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </SettingsCard>

            <SettingsCard className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette /> Creator Preferences</CardTitle>
                    <CardDescription>Customize your image generation experience.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">
                        More customization options coming soon!
                     </p>
                </CardContent>
            </SettingsCard>
        </div>
      </div>
    </>
  );
}
