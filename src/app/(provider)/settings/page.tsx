"use client";
import React from 'react';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, Save } from 'lucide-react';

const SettingsPage = () => {
    return (
        // FIX 1: Add a main container with responsive padding for proper spacing
        <div className="h-full w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <PageHeader 
                    title="Settings"
                    subtitle="Manage your profile, account, and notification preferences."
                />
                
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                            <User className="w-5 h-5 mr-3 text-blue-600"/>
                            Profile Information
                        </CardTitle>
                        <CardDescription className="pl-8">Update your personal and professional details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" defaultValue="Dr. Jane Smith" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="specialization">Specialization</Label>
                                <Input id="specialization" defaultValue="Radiology" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="dr.smith@hospital.com" />
                        </div>
                        <div className="flex justify-end pt-2">
                            {/* FIX 3: Added icon and consistent styling to the button */}
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Save className="w-4 h-4 mr-2" />
                                Save Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                            <Lock className="w-5 h-5 mr-3 text-blue-600"/>
                            Security
                        </CardTitle>
                        <CardDescription className="pl-8">Change your password and manage account security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Save className="w-4 h-4 mr-2" />
                                Update Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;