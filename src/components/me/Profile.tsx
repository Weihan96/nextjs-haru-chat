"use client"

import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Bell, CreditCard, LogOut, Mail, Shield, User } from 'lucide-react';
import { toast } from "sonner";
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const Profile = () => {
  // Sample usage data for the progress bar
  const usageData = {
    used: 65,
    total: 100,
    label: '65/100 chats'
  };
  
  const handleSave = () => {
    toast('Profile updated', {
      description: 'Your changes have been saved successfully.',
    });
  };
  
  const handleUpgrade = () => {
    toast('Subscription upgraded', {
      description: 'Thank you for upgrading to Premium!',
    });
  };
  
  return (
    <ScrollArea className="h-full">
      <div className="h-full space-y-8">
        <div className="py-3 px-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <img src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1" alt="User Avatar" className="object-cover" />
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and subscription</p>
          </div>
        </div>
        
        <Tabs defaultValue="account">
         <div className="px-4 py-2 w-screen sticky top-0 z-[50] bg-background">          
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
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="aicompanion_lover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" defaultValue="AI Enthusiast" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="user@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" defaultValue="Just someone who loves chatting with AI companions!" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
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
                <CardDescription>You are currently on the Free plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Remaining Chats Progress Bar */}
                <div className="mb-4 p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Progress value={usageData.used} className="h-1.5 bg-gray-100" />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Remaining Chats</span>
                      <span className="font-medium text-gray-600">{usageData.label}</span>
                    </div>
                  </div>
                </div>
                
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
                      <Button variant="outline" className="w-full">Upgrade</Button>
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
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <Button variant="outline">Add Payment Method</Button>
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
                      <Label>New Messages</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when your companions send you a message</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Companions</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new AI companions are added</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast("Notification settings saved")}>
                  Save Preferences
                </Button>
              </CardFooter>
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
