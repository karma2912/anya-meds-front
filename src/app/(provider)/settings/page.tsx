"use client";
import React from 'react';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Bell, Lock } from 'lucide-react';

const SettingsPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <PageHeader 
                title="Settings"
                subtitle="Manage your profile, account, and notification preferences."
            />
            
            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal and professional details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue="Dr. Jane Smith" />
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input id="specialization" defaultValue="Radiology" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="dr.smith@hospital.com" />
                    </div>
                    <div className="flex justify-end">
                        <Button>Save Profile</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Change your password and manage account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-1.5">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button>Update Password</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export default SettingsPage;
