"use client"

import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Loader2, User, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import Image from "next/image";
import { useUser } from '@clerk/nextjs';
import { useProfile, useUsage, useUpdateProfile } from '@/hooks/use-profile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, type ProfileFormData } from '@/lib/schemas/profile';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const Profile = () => {
  const { user: clerkUser } = useUser();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: usage, isLoading: usageLoading } = useUsage();
  const updateProfileMutation = useUpdateProfile();

  // React Hook Form setup
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      displayName: '',
      bio: ''
    }
  });

  // Update form values when profile loads
  React.useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        displayName: profile.displayName || '',
        bio: profile.bio || ''
      });
    }
  }, [profile, form]);

  // Show toast for profile loading errors
  React.useEffect(() => {
    if (profileError) {
      // Parse error message or use fallback
      let errorMessage = 'Please try refreshing the page'
      let debugInfo = profileError.message

      try {
        const errorData = JSON.parse(profileError.message)
        errorMessage = errorData.message || errorMessage
        debugInfo = errorData.debug
      } catch {
        // Use default message for non-JSON errors
      }

      console.error('🔴 Profile loading error:', debugInfo)
      toast.error('Failed to load profile', {
        description: errorMessage,
        duration: Infinity,
        action: {
          label: 'Retry',
          onClick: () => window.location.reload()
        }
      })
    }
  }, [profileError]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;

    // Only update fields that have changed
    const changes: Partial<ProfileFormData> = {};
    if (data.username !== profile.username) changes.username = data.username;
    if (data.displayName !== profile.displayName) changes.displayName = data.displayName;
    if (data.bio !== profile.bio) changes.bio = data.bio;

    if (Object.keys(changes).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync(changes);
      form.reset(data); // Reset form dirty state
    } catch (error) {
      // Error handling with toast is done in the useUpdateProfile hook
      // but we can add additional handling here if needed
      console.error('Form submission error:', error)
    }
  };

  const handleCancel = () => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        displayName: profile.displayName || '',
        bio: profile.bio || ''
      });
    }
  };

  const handleUpgrade = () => {
    toast.info('Subscription feature coming soon!', {
      description: 'We\'re working on implementing subscription plans.',
    });
  };

  // Loading skeleton
  if (profileLoading) {
    return (
      <ScrollArea className="h-full">
        <div className="h-full space-y-8">
          <div className="py-3 px-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="px-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Error state
  if (profileError) {
    return (
      <ScrollArea className="h-full">
        <div className="h-full flex items-center justify-center p-8">
          <Alert className="max-w-md" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load profile data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </ScrollArea>
    );
  }

  if (!profile) return null;

  // Use Clerk user image as fallback
  const displayImage = clerkUser?.imageUrl || profile.imageUrl || '/placeholder-avatar.png';
  const displayName = profile.displayName || clerkUser?.fullName || 'User';
  const email = profile.email || clerkUser?.primaryEmailAddress?.emailAddress || '';
  const isFormDirty = form.formState.isDirty;

  return (
    <ScrollArea className="h-full">
      <div className="h-full space-y-8">
        <div className="py-3 px-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <Image 
              src={displayImage} 
              alt={displayName} 
              className="object-cover" 
              width={96} 
              height={96}
            />
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground">Manage your account settings and subscription</p>
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
            )}
          </div>

          {/* User Stats */}
          <div className="flex gap-8 md:gap-12 px-8 md:px-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profile.totalChats}</div>
              <div className="text-sm text-muted-foreground">Chats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profile.totalMessages}</div>
              <div className="text-sm text-muted-foreground">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profile.companionsCreated}</div>
              <div className="text-sm text-muted-foreground">Companions</div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="account">
         <div className="px-4 py-2 w-full bg-background">          
            <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy" className="hidden md:inline-flex">Privacy</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="account" className="space-y-4 py-3 px-4 ">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter username"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter display name"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email is managed through your Clerk account
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself"
                              className="resize-none"
                              rows={3}
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={!isFormDirty || updateProfileMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!isFormDirty || updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4 py-3 px-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  You are currently on the {usage?.currentPlan === 'free' ? 'Free' : usage?.currentPlan === 'premium' ? 'Premium' : 'Pro'} plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Usage Progress Bar */}
                {usage && !usageLoading && (
                  <div className="mb-4 p-4 border border-gray-200 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Progress value={usage.usagePercentage} className="h-1.5 bg-gray-100" />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Daily Chat Usage</span>
                        <span className="font-medium text-gray-600">
                          {usage.remainingChats} chats remaining today
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-muted">
                    <CardHeader>
                      <CardTitle>Free</CardTitle>
                      <CardDescription>Current Plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">2000</Badge>
                          <span>Context Length</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">5</Badge>
                          <span>AI Companions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">50</Badge>
                          <span>Messages/Day</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-primary relative">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded-bl-md">
                      Popular
                    </div>
                    <CardHeader>
                      <CardTitle>Premium</CardTitle>
                      <CardDescription>Recommended</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">8000</Badge>
                          <span>Context Length</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Unlimited</Badge>
                          <span>AI Companions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Unlimited</Badge>
                          <span>Messages</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={handleUpgrade}>Upgrade Now</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-2 border-muted">
                    <CardHeader>
                      <CardTitle>Pro</CardTitle>
                      <CardDescription>For enthusiasts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">16000</Badge>
                          <span>Context Length</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Unlimited</Badge>
                          <span>AI Companions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline">Custom</Badge>
                          <span>Create Your Own</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" onClick={handleUpgrade}>Coming Soon</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6 text-muted-foreground">
                  No payment method required for free plan.
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  No billing history available for free plan.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 py-3 px-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive news and feature updates</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4 py-3 px-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Chat History</Label>
                      <p className="text-sm text-muted-foreground">Store chat history for improved companion responses</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Collection</Label>
                      <p className="text-sm text-muted-foreground">Allow anonymous usage data to improve our service</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Allow your profile to be visible to other users</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <Button variant="outline" className="w-full">Download My Data</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default Profile;
