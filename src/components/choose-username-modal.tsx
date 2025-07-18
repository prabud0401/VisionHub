
'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, CheckCircle, XCircle, UserPlus, AtSign } from 'lucide-react';
import { checkUsernameAvailability, setUsernameForUser } from '@/services/username-service';
import { useDebounce } from 'use-debounce';

interface ChooseUsernameModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: () => void;
}

export function ChooseUsernameModal({ isOpen, onOpenChange, onSave }: ChooseUsernameModalProps) {
  const [username, setUsername] = useState('');
  const [debouncedUsername] = useDebounce(username, 500);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedUsername) {
        setIsAvailable(null);
        return;
      }
      setIsChecking(true);
      try {
        const available = await checkUsernameAvailability(debouncedUsername);
        setIsAvailable(available);
      } catch (err) {
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkAvailability();
  }, [debouncedUsername]);

  const handleSave = async () => {
    if (!user || !isAvailable) {
        toast({ variant: "destructive", title: "Username is not available." });
        return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await setUsernameForUser(user.uid, username);
      toast({
        title: 'Username Set!',
        description: `Welcome to VisionHub, @${username}!`,
      });
      onSave(); // This will refresh user data in the context
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUsernameStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    if (debouncedUsername.length < 3) return null;
    if (isAvailable === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (isAvailable === false) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }
    return null;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            Choose Your Username
          </DialogTitle>
          <DialogDescription>
            Create a unique username for your VisionHub profile. This cannot be changed later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="your_cool_name"
                        className="pl-8"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {getUsernameStatusIcon()}
                    </div>
                </div>
                {isAvailable === false && <p className="text-sm text-destructive">This username is already taken.</p>}
                {username.length > 0 && username.length < 3 && <p className="text-sm text-muted-foreground">Username must be at least 3 characters.</p>}
                 {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={isLoading || !isAvailable || username.length < 3}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
