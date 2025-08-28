"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Phone, Mail, Loader2 } from 'lucide-react';

const NewPatientPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // In a real app, you would gather form data
        const formData = { name: 'New Patient', dob: '2000-01-01' }; 
        
        await fetch('/api/provider/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        
        setIsLoading(false);
        router.push('/patients');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <PageHeader 
                title="Add New Patient"
                subtitle="Create a new patient record in the system."
            />
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="John Doe" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" required />
                            </div>
                             <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="gender">Gender</Label>
                                <Input id="gender" placeholder="e.g., Male, Female" />
                            </div>
                        </div>
                         <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="patient@email.com" />
                        </div>
                         <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="(123) 456-7890" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                {isLoading ? 'Saving...' : 'Save Patient Record'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};
export default NewPatientPage;
