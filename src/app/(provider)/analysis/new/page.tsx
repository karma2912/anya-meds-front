"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2, Stethoscope, FileText, User, HeartPulse, Brain, Bandage, AlertTriangle, Check, ChevronsUpDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- New Imports for the Searchable Combobox ---
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Define the Patient type to match your data
type Patient = {
    _id: string;
    name: string;
    id: string; // The user-friendly ID like p-123456
};

const NewAnalysisPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysisType, setAnalysisType] = useState('');
    const [error, setError] = useState<string | null>(null);

    // --- State for the new patient dropdown ---
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isPatientsLoading, setIsPatientsLoading] = useState(true);
    const [openPopover, setOpenPopover] = useState(false);

    // --- Step 1: Fetch the doctor's patients when the component mounts ---
    useEffect(() => {
        const fetchPatientsForDoctor = async () => {
            try {
                const response = await fetch('/api/provider/patients');
                if (!response.ok) {
                    throw new Error("Could not fetch your patient list.");
                }
                const data = await response.json();
                setPatients(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsPatientsLoading(false);
            }
        };
        fetchPatientsForDoctor();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPatient?._id || !selectedFile || !analysisType) {
            setError('Please select a patient, an analysis type, and upload an image.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('patientId', selectedPatient._id); // Use the real MongoDB _id
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
            router.push(`/case-review/${result.caseId}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <PageHeader
                title="New Medical Analysis"
                subtitle="Upload diagnostic images for AI-powered analysis and clinical insights."
            />
            
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 md:p-8 space-y-8 mt-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {/* --- Step 2: Replace the Patient ID input with the Combobox --- */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
                        </div>
                        <div>
                            <Label htmlFor="patientId">Select Patient</Label>
                            <Popover open={openPopover} onOpenChange={setOpenPopover}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openPopover}
                                        className="w-full justify-between h-11 text-base font-medium mt-2 border-gray-300"
                                        disabled={isPatientsLoading}
                                    >
                                        {isPatientsLoading ? "Loading patients..." :
                                         selectedPatient ? `${selectedPatient.name} (${selectedPatient.id})` : "Select patient..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search patient by name or ID..." />
                                        <CommandList>
                                            <CommandEmpty>No patient found.</CommandEmpty>
                                            <CommandGroup>
                                                {patients.map((patient) => (
                                                    <CommandItem
                                                        key={patient._id}
                                                        value={`${patient.name} ${patient.id}`}
                                                        onSelect={() => {
                                                            setSelectedPatient(patient);
                                                            setOpenPopover(false);
                                                        }}
                                                    >
                                                        <Check className={`mr-2 h-4 w-4 ${selectedPatient?._id === patient._id ? "opacity-100" : "opacity-0"}`} />
                                                        {patient.name} <span className="text-xs text-gray-500 ml-2">({patient.id})</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
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
                            <Select required onValueChange={setAnalysisType} value={analysisType}>
                                <SelectTrigger id="scanType" className="h-11 mt-2 border-blue-200 focus:border-blue-500">
                                    <SelectValue placeholder="Select analysis type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="chest"><HeartPulse className="w-4 h-4 mr-2" />Chest X-Ray</SelectItem>
                                    <SelectItem value="brain"><Brain className="w-4 h-4 mr-2" />Brain MRI</SelectItem>
                                    <SelectItem value="skin"><Bandage className="w-4 h-4 mr-2" />Skin Lesion</SelectItem>
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

                    <div className="flex justify-end pt-4 border-t">
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