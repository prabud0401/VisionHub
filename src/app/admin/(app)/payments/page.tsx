
'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, ExternalLink, Gem } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getPaymentSubmissions, approvePaymentAndAddCredits } from '@/services/payment-service';
import Link from 'next/link';

interface PaymentSubmission {
    id: string;
    userId: string;
    userDisplayName: string;
    plan: {
        name: string;
        price: string;
        credits: number;
    };
    paymentSlipUrl: string;
    createdAt: string;
    approved: boolean;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const submissions = await getPaymentSubmissions();
      setPayments(submissions as PaymentSubmission[]);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load payment submissions.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [toast]);

  const handleApprove = async (payment: PaymentSubmission) => {
    setIsApproving(payment.id);
    try {
        await approvePaymentAndAddCredits(payment.id, payment.userId, payment.plan.credits);
        toast({ title: 'Payment Approved!', description: `${payment.userDisplayName} has been granted ${payment.plan.credits} credits.` });
        fetchPayments(); // Refetch to update the status in the UI
    } catch (error) {
         console.error('Failed to approve payment:', error);
         toast({ variant: 'destructive', title: 'Approval Failed', description: 'Could not approve the payment. Please try again.' });
    } finally {
        setIsApproving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Submissions</CardTitle>
        <CardDescription>Review and approve user payment submissions for credit allocation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Slip</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.userDisplayName}</TableCell>
                <TableCell>{payment.plan.name} ({payment.plan.price})</TableCell>
                <TableCell className="text-center">
                    <span className="flex items-center justify-center gap-1 font-semibold">
                        <Gem className="h-4 w-4 text-primary" />
                        {payment.plan.credits}
                    </span>
                </TableCell>
                <TableCell>{format(parseISO(payment.createdAt), 'PPP')}</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={payment.paymentSlipUrl} target="_blank" rel="noopener noreferrer">
                      View Slip <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  {payment.approved ? (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-green-500/30">
                        <CheckCircle className="mr-1 h-3 w-3" />Approved
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleApprove(payment)}
                    disabled={payment.approved || isApproving === payment.id}
                    size="sm"
                  >
                    {isApproving === payment.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {payments.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                No payment submissions found.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
