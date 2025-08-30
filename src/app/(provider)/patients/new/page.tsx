// In: app/(provider)/patients/new/page.tsx

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Phone, Mail, Loader2, PlusCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NewPatientPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // FIX 1: Add state to hold the data from each form input
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // FIX 2: Replace the simulated API call with a real one
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Gather the form data from the component's state
        const patientData = {
            name: fullName,
            dob,
            gender,
            email,
            phone,
        };

        try {
            // Send the real data to your API endpoint
            const response = await fetch('/api/provider/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create patient.');
            }

            // On success, redirect to the patient list to see the new entry
            router.push('/patients');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
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
                
                {/* Section to display any submission errors */}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

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
                            {/* FIX 3: Connect inputs to state using `value` and `onChange` */}
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                                <Input 
                                    id="fullName" 
                                    placeholder="John Doe" 
                                    required 
                                    className="border-blue-200 focus:border-blue-500 h-11"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="dob" className="text-gray-700">Date of Birth</Label>
                                    <Input 
                                        id="dob" 
                                        type="date" 
                                        required 
                                        className="border-blue-200 focus:border-blue-500 h-11"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                                    <Input 
                                        id="gender" 
                                        placeholder="e.g., Male, Female" 
                                        className="border-blue-200 focus:border-blue-500 h-11"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
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
                                        className="border-blue-200 focus:border-blue-500 h-11 pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        className="border-blue-200 focus:border-blue-500 h-11 pl-10"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 font-medium"
                                >
                                    {isLoading ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</>
                                    ) : (
                                        <><PlusCircle className="w-5 h-5 mr-2" />Save Patient Record</>
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