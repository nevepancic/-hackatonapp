/** @format */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  getCurrentUser,
  getUserData,
  updateCompanyName,
  deleteUserProfile,
  type UserData,
} from '@/lib/functions/user';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        const data = await getUserData(user.id);
        setUserData(data);
        setCompanyName(data.company_name);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleUpdateCompanyName = async () => {
    try {
      if (!userData) return;
      await updateCompanyName(userData.id, companyName);
      setUserData((prev) =>
        prev ? { ...prev, company_name: companyName } : null
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating company name:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      if (!userData) return;
      await deleteUserProfile(userData.id);
      router.push('/auth/signup');
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label>Full Name</Label>
            <div className='text-lg font-medium'>{userData.full_name}</div>
          </div>

          <div className='space-y-2'>
            <Label>Role</Label>
            <div className='text-lg font-medium'>{userData.role}</div>
          </div>

          <div className='space-y-2'>
            <Label>Company Name</Label>
            {isEditing ? (
              <div className='flex gap-2'>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className='max-w-sm'
                />
                <Button onClick={handleUpdateCompanyName}>Save</Button>
                <Button variant='outline' onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <span className='text-lg font-medium'>
                  {userData.company_name}
                </span>
                <Button variant='outline' onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </div>
            )}
          </div>

          <div className='pt-6'>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant='destructive'>Delete Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant='destructive' onClick={handleDeleteProfile}>
                    Delete Profile
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
