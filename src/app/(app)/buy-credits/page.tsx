
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Check, CreditCard, Gem, Landmark, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { submitPaymentForReview, uploadPaymentSlip } from '@/services/payment-service';
import Image from 'next/image';

interface PlanDetails {
  id: string;
  name: string;
  price: string;
  credits: number;
  billing: 'monthly' | 'annually';
}

const GooglePayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
      <path d="M6 12l2 -2" />
      <path d="M8 12l2 2" />
      <path d="M12 8l2 2" />
      <path d="M12 14l2 -2" />
      <path d="M14 12l2 -2" />
      <path d="M16 12l2 2" />
    </svg>
);


// Helper to compress and convert image file to a base64 data URI
async function compressImage(file: File, quality = 0.8, maxDimension = 1024): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const { width, height } = img;
                let newWidth = width;
                let newHeight = height;

                if (width > height) {
                    if (width > maxDimension) {
                        newHeight = height * (maxDimension / width);
                        newWidth = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        newWidth = width * (maxDimension / height);
                        newHeight = maxDimension;
                    }
                }

                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Could not get canvas context'));
                
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                // Convert to JPEG for compression
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}


export default function BuyCreditsPage() {
  const [selectedPlan, , planLoaded] = useLocalStorage<PlanDetails | null>('selectedPlan', null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('payhere');
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Wait until the plan has been loaded from local storage
    if (planLoaded) {
      if (!selectedPlan || !user) {
        router.push('/pricing');
      }
    }
  }, [selectedPlan, user, router, planLoaded]);

  const handlePayment = async () => {
    if (paymentMethod === 'bank-transfer' && !paymentSlip) {
        toast({ variant: "destructive", title: "Error", description: "Payment slip is required for bank transfers." });
        return;
    }
    if (!user || !selectedPlan) return;

    setIsSubmitting(true);
    
    // Placeholder for PayHere integration
    if (paymentMethod === 'payhere') {
      toast({
        title: "Redirecting to PayHere...",
        description: "This is a simulation. In a real app, you would be redirected."
      });
      // Simulate API call and success
      setTimeout(() => {
        setIsSubmitting(false);
        setReferenceId(`PH-${Date.now().toString().slice(-8)}`);
        setIsSubmitted(true);
      }, 2000);
      return;
    }

    // Existing Bank Transfer Logic
    try {
      if (paymentSlip) {
        // Compress the image before getting its data
        const compressedDataUrl = await compressImage(paymentSlip);
        const base64Data = compressedDataUrl.split(',')[1];
        const fileName = `${user.uid}-${Date.now()}-compressed.jpg`;
        const mimeType = 'image/jpeg';

        const slipUrl = await uploadPaymentSlip(base64Data, fileName, mimeType);
        
        const newReferenceId = `BT-${Date.now().toString().slice(-8)}`;
        
        await submitPaymentForReview({
            userId: user.uid,
            userEmail: user.email,
            userDisplayName: user.displayName,
            plan: selectedPlan,
            paymentSlipUrl: slipUrl,
            referenceId: newReferenceId,
        });
        setReferenceId(newReferenceId);
        setIsSubmitted(true);
      }
    } catch(error) {
        console.error("Payment submission failed:", error);
        toast({ variant: "destructive", title: "Submission Failed", description: "Could not submit your payment for review. Please try again." });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!planLoaded || !selectedPlan) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
        <div className="container mx-auto max-w-2xl py-20 px-4">
            <Card className="text-center p-8 shadow-lg">
                <CardHeader>
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <CardTitle className="text-3xl">Payment Submitted!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Thank you for your purchase. Your payment is currently under review. You will receive an email confirmation once your credits have been added to your account. This usually takes 1-2 business days.
                    </p>
                    <Alert className="text-left">
                        <AlertTitle>Your Payment Reference</AlertTitle>
                        <AlertDescription className="font-mono text-lg font-bold tracking-widest">{referenceId}</AlertDescription>
                    </Alert>
                    <Button onClick={() => router.push('/dashboard')} className="mt-6">Go to Dashboard</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-transparent sm:text-6xl bg-gradient-to-r from-primary to-purple-400 bg-clip-text">
          Complete Your Purchase
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          You're about to add more credits to your account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{selectedPlan.name} Plan</CardTitle>
                <CardDescription className="capitalize">{selectedPlan.billing} Billing</CardDescription>
              </div>
              <div className="text-right">
                  <p className="text-4xl font-bold">{selectedPlan.price}</p>
                  <p className="flex items-center justify-end gap-2 text-primary font-semibold">
                      <Gem className="h-5 w-5" />
                      {selectedPlan.credits} credits
                  </p>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="shadow-lg md:col-span-2">
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you'd like to pay.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="payhere">
                            <span className="flex items-center">
                                <Image src="https://www.payhere.lk/downloads/images/payhere_long_logo.png" alt="PayHere" width={80} height={20} className="mr-2" />
                            </span>
                        </SelectItem>
                        <SelectItem value="bank-transfer">
                            <span className="flex items-center"><Landmark className="mr-2 h-4 w-4" /> Bank Transfer</span>
                        </SelectItem>
                        <SelectItem value="google-pay" disabled>
                            <span className="flex items-center"><GooglePayIcon /> Google Pay (Coming Soon)</span>
                        </SelectItem>
                         <SelectItem value="card" disabled>
                             <span className="flex items-center"><CreditCard className="mr-2 h-4 w-4" /> Visa/Debit Card (Coming Soon)</span>
                        </SelectItem>
                    </SelectContent>
                </Select>

                {paymentMethod === 'payhere' && (
                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">You will be redirected to PayHere to complete your payment securely.</p>
                    </div>
                )}
                
                {paymentMethod === 'bank-transfer' && (
                    <div className="mt-6 space-y-6">
                        <Separator />
                        <Alert>
                            <Landmark className="h-4 w-4" />
                            <AlertTitle>Bank Transfer Instructions</AlertTitle>
                            <AlertDescription className="space-y-2 mt-2">
                                <p>Please transfer the total amount to the following bank account:</p>
                                <ul className="text-xs list-disc list-inside space-y-1">
                                    <li><strong>Bank Name:</strong> First Century Bank</li>
                                    <li><strong>Bank Address:</strong> 1731 N Elm St Commerce, GA 30529 USA</li>
                                    <li><strong>Routing (ABA):</strong> 061120084</li>
                                    <li><strong>Account Number:</strong> 4024939311976</li>
                                    <li><strong>Account Type:</strong> CHECKING</li>
                                    <li><strong>Beneficiary Name:</strong> Udayasooriyan Prabudeva</li>
                                    <li><strong>Reference:</strong> Your Username ({user?.username})</li>
                                </ul>
                            </AlertDescription>
                        </Alert>
                         <div className="space-y-2">
                            <Label htmlFor="payment-slip">Upload Payment Slip</Label>
                            <Input 
                                id="payment-slip" 
                                type="file" 
                                onChange={(e) => setPaymentSlip(e.target.files?.[0] || null)}
                                accept="image/png, image/jpeg, application/pdf"
                                className="file:text-primary file:font-semibold"
                             />
                            <p className="text-xs text-muted-foreground">Please upload a screenshot or PDF of your transaction receipt.</p>
                        </div>
                    </div>
                )}
            </CardContent>
             <CardFooter>
                <Button 
                    onClick={handlePayment} 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting || (paymentMethod === 'bank-transfer' && !paymentSlip)}
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : `Pay ${selectedPlan.price} Now`}
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
