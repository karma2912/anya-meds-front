"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, UserPlus, HeartPulse, Brain, Bandage, Loader2,Stethoscope } from 'lucide-react';

const NewAnalysisPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, you'd get the new case ID from the API response
            router.push('/case-review/c-12345'); 
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader 
                title="New Analysis"
                subtitle="Upload a new scan for AI-powered diagnostic support."
            />
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    {/* Patient Information */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">1. Patient Information</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="patientId">Patient ID or Name</Label>
                                <Input id="patientId" placeholder="Search for existing patient..." />
                            </div>
                            <div className="flex items-end">
                                <Button type="button" variant="outline" className="w-full" onClick={() => router.push('/patients/new')}>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add New Patient
                                </Button>
                            </div>
                        </div>
                    </fieldset>

                    {/* Scan Details */}
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">2. Scan Details</legend>
                        <div>
                            <Label htmlFor="scanType">Analysis Type</Label>
                            <Select required>
                                <SelectTrigger id="scanType">
                                    <SelectValue placeholder="Select scan type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="chest"><div className="flex items-center"><HeartPulse className="w-4 h-4 mr-2 text-blue-500" />Chest X-Ray</div></SelectItem>
                                    <SelectItem value="brain"><div className="flex items-center"><Brain className="w-4 h-4 mr-2 text-purple-500" />Brain MRI</div></SelectItem>
                                    <SelectItem value="skin"><div className="flex items-center"><Bandage className="w-4 h-4 mr-2 text-orange-500" />Skin Lesion</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="scanImage">Upload Image</Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="scanImage" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <Input id="scanImage" name="scanImage" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">DICOM, PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="notes">Clinical Notes (Optional)</Label>
                            <Textarea id="notes" placeholder="Enter any relevant clinical history or notes..." />
                        </div>
                    </fieldset>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" size="lg" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Stethoscope className="w-5 h-5 mr-2" />}
                            {isLoading ? 'Analyzing...' : 'Submit for Analysis'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default NewAnalysisPage;