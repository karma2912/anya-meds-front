"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Phone, Mail, Loader2, PlusCircle } from 'lucide-react';

const NewPatientPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // In a real app, you would gather form data
        const formData = { name: 'New Patient', dob: '2000-01-01' }; 
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsLoading(false);
        router.push('/patients');
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center py-8 p-4">
            <div className="w-full max-w-2xl">
                <div className='mb-6'>
                    <PageHeader 
                        title="Add New Patient"
                        subtitle="Create a new patient record in the system."
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <Card className="border-blue-100 shadow-md rounded-xl">
                        <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-xl p-5">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl text-gray-800">Patient Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 ">
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                                <Input 
                                    id="fullName" 
                                    placeholder="John Doe" 
                                    required 
                                    className="border-blue-200 focus:border-blue-500 h-11"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="dob" className="text-gray-700">Date of Birth</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input 
                                            id="dob" 
                                            type="date" 
                                            required 
                                            className="border-blue-200 focus:border-blue-500 h-11 pl-10"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                                    <Input 
                                        id="gender" 
                                        placeholder="e.g., Male, Female" 
                                        required
                                        className="border-blue-200 focus:border-blue-500 h-11"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="patient@email.com" 
                                        required
                                        className="border-blue-200 focus:border-blue-500 h-11 pl-10"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input 
                                        id="phone" 
                                        type="tel" 
                                        placeholder="(123) 456-7890" 
                                        required
                                        className="border-blue-200 focus:border-blue-500 h-11 pl-10"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    size="lg" // Using the size prop for consistent padding
                                    className="bg-blue-600 hover:bg-blue-700 font-medium"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="w-5 h-5 mr-2" />
                                            Save Patient Record
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default NewPatientPage;