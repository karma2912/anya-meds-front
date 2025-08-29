"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, UserPlus, HeartPulse, Brain, Bandage, Loader2, Stethoscope, FileText, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';


const NewAnalysisPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysisType, setAnalysisType] = useState('');
    // FIX 1: Add state for the Patient ID
    const [patientId, setPatientId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // FIX 2: Add patientId to the validation
        if (!patientId || !selectedFile || !analysisType) {
            setError('Please provide a Patient ID, select an analysis type, and upload an image.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        // FIX 3: Add patientId to the form data
        formData.append('patientId', patientId);
        formData.append('scanImage', selectedFile);
        formData.append('analysisType', analysisType);

        try {
            const response = await fetch('/api/provider/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed. Please try again.');
            }

            const result = await response.json();
            const newCaseId = result.caseId || `c-${Date.now()}`;
            router.push(`/case-review/${newCaseId}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-6">
                <PageHeader
                    title="New Medical Analysis"
                    subtitle="Upload diagnostic images for AI-powered analysis and clinical insights."
                />
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 md:p-8 space-y-6">
                    {/* Display Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
  <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
                        </div>
                        <div>
                            <Label htmlFor="patientId">Patient ID (MRN)</Label>
                            <Input
                                id="patientId"
                                placeholder="Enter patient's medical record number..."
                                className="mt-2 h-11"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {/* Scan Details Section */}
                    <div className="space-y-4">
                         <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Scan Details</h2>
                        </div>
                        
                        <div>
                            <Label htmlFor="scanType">Analysis Type</Label>
                            {/* Pass the selected value to your state */}
                            <Select required onValueChange={setAnalysisType} value={analysisType}>
                                <SelectTrigger id="scanType" className="h-11 mt-2 border-blue-200 focus:border-blue-500">
                                    <SelectValue placeholder="Select analysis type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="chest"><HeartPulse className="w-4 h-4 mr-2" /> Chest X-Ray</SelectItem>
                                    <SelectItem value="brain"><Brain className="w-4 h-4 mr-2" /> Brain MRI</SelectItem>
                                    <SelectItem value="skin"><Bandage className="w-4 h-4 mr-2" /> Skin Lesion</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <Label htmlFor="scanImage">Upload Medical Image</Label>
                            <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${selectedFile ? 'border-blue-300 bg-blue-50' : 'border-blue-200 border-dashed'} rounded-md`}>
                                <div className="space-y-3 text-center">
                                    <Upload className={`mx-auto h-12 w-12 ${selectedFile ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="scanImage" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                            <span>Upload a medical image</span>
                                            <Input id="scanImage" name="scanImage" type="file" className="sr-only" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.dcm" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    {selectedFile ? (
                                        <p className="text-sm text-blue-600 font-medium">{selectedFile.name}</p>
                                    ) : (
                                        <p className="text-xs text-gray-500">PNG, JPG, DICOM up to 10MB</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" size="lg" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                            ) : (
                                <><Stethoscope className="w-5 h-5 mr-2" /> Submit for Analysis</>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default NewAnalysisPage;