
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, ShieldCheck, ShieldAlert, Edit, Gem, User, Mail, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { getAllUsers, deleteUser, updateUserCredits, updateUserAdStatus, type AdminUser } from '@/services/admin-service';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);
  const [newCredits, setNewCredits] = useState<number>(0);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load users.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user);
  };
  
  const handleEditClick = (user: AdminUser) => {
    setUserToEdit(user);
    setNewCredits(user.credits ?? 0);
  };


  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.uid);
      toast({ title: 'User Deleted', description: `${userToDelete.displayName} has been permanently deleted.` });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete user.' });
    } finally {
      setUserToDelete(null);
    }
  };
  
  const handleUpdateCredits = async () => {
    if (!userToEdit) return;
    setIsUpdating(true);
    try {
        await updateUserCredits(userToEdit.uid, newCredits);
        toast({ title: 'Credits Updated', description: `${userToEdit.displayName}'s credits set to ${newCredits}.` });
        fetchUsers();
    } catch (error) {
         console.error('Failed to update credits:', error);
         toast({ variant: 'destructive', title: 'Error', description: 'Failed to update credits.' });
    } finally {
        setIsUpdating(false);
        setUserToEdit(null);
    }
  };

  const handleToggleAds = async (user: AdminUser) => {
    const newShowAds = !user.showAds;
    try {
        await updateUserAdStatus(user.uid, newShowAds);
        toast({ title: 'Ad Status Updated', description: `Ads for ${user.displayName} are now ${newShowAds ? 'ON' : 'OFF'}.` });
        fetchUsers(); // Refetch to update UI
    } catch (error) {
        console.error('Failed to update ad status:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update ad status.' });
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>A list of all users in your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead>Ad Status</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.photoURL ?? ''} />
                        <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>@{user.username}</TableCell>
                   <TableCell className="text-center font-medium">
                     <span className="flex items-center justify-center gap-1">
                        <Gem className="h-4 w-4 text-primary" />
                        {user.credits ?? 0}
                     </span>
                   </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Switch
                            id={`ads-for-${user.uid}`}
                            checked={user.showAds}
                            onCheckedChange={() => handleToggleAds(user)}
                            aria-label={`Toggle ads for ${user.displayName}`}
                        />
                         <Badge variant={user.showAds ? "destructive" : "secondary"}>
                            {user.showAds ? 'Ads ON' : 'Ads OFF'}
                        </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{format(parseISO(user.createdAt), 'PPP')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit User</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick(user)}
                          disabled={user.email === 'prabud0401@gmail.com'}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete User</span>
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user <strong>{userToDelete?.displayName}</strong> and all their data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={!!userToEdit} onOpenChange={() => setUserToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Credits</DialogTitle>
            <DialogDescription>
                Update the credit balance for {userToEdit?.displayName}.
            </DialogDescription>
          </DialogHeader>
           <div className="py-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4"/>
                    <span>{userToEdit?.displayName} (@{userToEdit?.username})</span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4"/>
                    <span>{userToEdit?.email}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="credits" className="flex items-center gap-2">
                        <Gem className="h-4 w-4 text-primary" />
                        Credit Balance
                    </Label>
                    <Input 
                        id="credits"
                        type="number"
                        value={newCredits}
                        onChange={(e) => setNewCredits(Number(e.target.value))}
                        className="w-full"
                    />
                </div>
           </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUserToEdit(null)}>Cancel</Button>
            <Button onClick={handleUpdateCredits} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
               Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
