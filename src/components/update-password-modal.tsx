'use client';

import { useState } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const passwordSchema = z.object({
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export function UpdatePasswordModal({ isOpen, onOpenChange }: UpdatePasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUserPassword } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validate: zodResolver(passwordSchema),
  });

  const handleSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateUserPassword(values.newPassword);
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      onOpenChange(false);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-primary" />
            Update Your Password
          </DialogTitle>
          <DialogDescription>
            Enter and confirm your new password below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...form.getInputProps('newPassword')}
            />
            {form.errors.newPassword && (
              <p className="text-sm font-medium text-destructive">{form.errors.newPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...form.getInputProps('confirmPassword')}
            />
            {form.errors.confirmPassword && (
              <p className="text-sm font-medium text-destructive">{form.errors.confirmPassword}</p>
            )}
          </div>
           {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
