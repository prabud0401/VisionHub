
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, User, Palette, Shield, CreditCard, AtSign, Gem, PlusCircle, CheckCircle } from 'lucide-react';
import { UpdatePasswordModal } from '@/components/update-password-modal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { getPaymentHistoryForUser, type UserPayment } from '@/services/payment-service';
import { Loader2 } from 'lucide-react';

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

const PaymentHistory = ({ userId }: { userId: string }) => {
    const [payments, setPayments] = useState<UserPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const history = await getPaymentHistoryForUser(userId);
                setPayments(history);
            } catch (error) {
                console.error("Failed to fetch payment history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [userId]);

    return (
        <SettingsCard className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard /> Payment History</CardTitle>
                <CardDescription>View your past credit purchases and their status.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : payments.length === 0 ? (
                    <p className="text-muted-foreground text-center">No payment history found.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{format(parseISO(p.createdAt), 'PPP')}</TableCell>
                                    <TableCell>{p.plan.name} ({p.plan.price})</TableCell>
                                    <TableCell className="font-mono">{p.referenceId || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.approved ? 'secondary' : 'outline'}>
                                            {p.approved ? <CheckCircle className="mr-1 h-3 w-3 text-green-500" /> : null}
                                            {p.approved ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </SettingsCard>
    );
};


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
                <p className="text-muted-foreground">@{user.username}</p>
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
                        <span className="text-sm text-muted-foreground">Username</span>
                        <span>@{user.username}</span>
                    </div>
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

            <SettingsCard>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Gem /> Credits</CardTitle>
                    <CardDescription>Your current image generation credit balance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-4xl font-bold">{user.credits ?? 0}</p>
                            <p className="text-muted-foreground">Credits remaining</p>
                        </div>
                        <Button asChild>
                           <Link href="/pricing">
                               <PlusCircle className="mr-2 h-4 w-4" />
                               Get More Credits
                           </Link>
                        </Button>
                    </div>
                </CardContent>
            </SettingsCard>

            <PaymentHistory userId={user.uid} />
        </div>
      </div>
    </>
  );
}
