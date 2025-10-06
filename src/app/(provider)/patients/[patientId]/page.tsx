'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mars, Venus, VenusAndMars, Phone } from "lucide-react";
import {
    AlertTriangle, User, Stethoscope, Mail, FileText, Download, BrainCircuit, HeartPulse, Scan,
    History, FileDown, ShieldCheck
} from "lucide-react";

// Define the type for a single case
interface Case {
    _id: string;
    scanType: string;
    analysisDate: string;
    status: string;
    primaryDiagnosis: string;
    confidenceScore: number;
}

// Define the type for the full patient object with their cases
interface PatientWithCases {
    _id: string;
    id: string;
    name: string;
    part: string;
    gender: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    cases?: Case[];
}

const PatientProfilePage = () => {
    const params = useParams();
    const router = useRouter();
    const patientId = params.patientId as string;

    const [patient, setPatient] = useState<PatientWithCases | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!patientId) return;

        const fetchPatientDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/provider/patients/${patientId}`);
                if (!res.ok) {
                    throw new Error('Patient not found or you are not authorized to view this record.');
                }
                const data = await res.json();
                setPatient(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "reviewed": 
            case "completed":
                return <Badge variant="default" className="bg-green-100 text-green-800">Reviewed</Badge>;
            default: 
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        }
    };
    
    const getScanIcon = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes("brain")) return <BrainCircuit className="h-5 w-5 text-blue-500" />;
        if (lowerType.includes("chest")) return <HeartPulse className="h-5 w-5 text-red-500" />;
        if (lowerType.includes("skin")) return <Scan className="h-5 w-5 text-orange-500" />;
        return <FileText className="h-5 w-5 text-gray-500" />;
    };
    
    const getGenderIcon = (gender: string) => {
        const lowerGender = gender.toLowerCase();
        if (lowerGender === "male") return <Mars className="h-5 w-5 text-gray-400" />;
        if (lowerGender === "female") return <Venus className="h-5 w-5 text-gray-400" />;
        return <VenusAndMars className="h-5 w-5 text-gray-400" />;
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
    }

    if (error || !patient) {
        return (
             <div className="flex h-screen items-center justify-center text-center p-4">
                <Card className="p-8 shadow-lg">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <CardTitle>Error Loading Patient</CardTitle>
                    <CardDescription className="mt-2">{error || "Patient data could not be loaded."}</CardDescription>
                    <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
                </Card>
            </div>
        );
    }

    const cases = patient.cases || [];
    const latestCase = cases.length > 0 ? cases[0] : null; // Already sorted by backend
    const reviewedScansCount = cases.filter(s => s.status.toLowerCase() === 'completed' || s.status.toLowerCase() === 'reviewed').length;
    const pendingScansCount = cases.length - reviewedScansCount;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Patient Profile</h1>
                        <p className="text-gray-600 mt-1">View and manage patient information and medical imaging data</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex items-center gap-2"><FileDown className="h-4 w-4" />PDF Report</Button>
                        <Button variant="outline" className="flex items-center gap-2"><Download className="h-4 w-4" />Export Data</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="lg:col-span-1 space-y-6 lg:space-y-8">
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <Avatar className="h-24 w-24 border-2 border-blue-100">
                                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                        <AvatarFallback className="bg-blue-50 text-blue-600"><User className="h-10 w-10" /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
                                        <p className="text-gray-600 mt-1">Patient ID: {patient.id}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader className="pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Download className="h-5 w-5 text-blue-600" />Reports & Exports</CardTitle></CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <Button variant="outline" className="justify-start"><FileDown className="h-4 w-4 mr-2" />Generate PDF Report</Button>
                                <Button variant="outline" className="justify-start"><Download className="h-4 w-4 mr-2" />Download Images (ZIP)</Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader><CardTitle className="text-xl font-bold text-gray-800">Patient Details</CardTitle></CardHeader>
                            {/* --- THIS SECTION IS NOW DYNAMICALLY FILLED --- */}
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div><p className="text-sm text-gray-500">Full Name</p><p className="font-semibold">{patient.name}</p></div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        {getGenderIcon(patient.gender)}
                                        <div><p className="text-sm text-gray-500">Gender</p><p className="font-semibold">{patient.gender}</p></div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Stethoscope className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div><p className="text-sm text-gray-500">Primary Area</p><p className="font-semibold">{patient.part}</p></div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div><p className="text-sm text-gray-500">Patient ID (MRN)</p><p className="font-mono text-sm">{patient.id}</p></div>
                                    </div>
                                    <div className="flex items-start gap-3 md:col-span-2">
                                        <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div><p className="text-sm text-gray-500">Email</p><p className="font-semibold">{patient.email || 'N/A'}</p></div>
                                    </div>
                                    <div className="flex items-start gap-3 md:col-span-2">
                                        <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div><p className="text-sm text-gray-500">Phone</p><p className="font-semibold">{patient.phone || 'N/A'}</p></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader><CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-600"><ShieldCheck className="h-6 w-6" />Summary Snapshot</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {latestCase ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                            <div className="bg-blue-50 p-4 rounded-lg"><p className="text-sm text-blue-800/70">Latest AI Diagnosis</p><p className="text-xl font-bold text-blue-900">{latestCase.primaryDiagnosis}</p></div>
                                            <div className="bg-blue-50 p-4 rounded-lg"><p className="text-sm text-blue-800/70">Confidence Score</p><p className="text-xl font-bold text-blue-900">{(latestCase.confidenceScore * 100).toFixed(1)}%</p></div>
                                        </div>
                                        {latestCase.confidenceScore > 0.9 && (
                                            <Alert variant="destructive" className="bg-red-50 border-red-200"><AlertTriangle className="h-4 w-4" /><AlertTitle className="font-bold">High Priority Finding</AlertTitle><AlertDescription>Atypical lesion detected, requires dermatologist review.</AlertDescription></Alert>
                                        )}
                                    </>
                                ) : <p className="text-gray-500 text-center py-4">No analysis has been performed for this patient yet.</p>}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6 lg:space-y-8">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader><CardTitle className="text-lg font-bold text-gray-800">Status Overview</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Total Scans</span><Badge variant="secondary">{cases.length}</Badge></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Reviewed</span><Badge variant="default" className="bg-green-100 text-green-800">{reviewedScansCount}</Badge></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Pending</span><Badge variant="secondary">{pendingScansCount}</Badge></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Last Update</span><span className="text-sm font-semibold">{latestCase ? new Date(latestCase.analysisDate).toLocaleDateString() : 'N/A'}</span></div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader><CardTitle className="text-lg font-bold text-gray-800">Quick Stats</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-900">{latestCase ? `${(latestCase.confidenceScore * 100).toFixed(1)}%` : 'N/A'}</p>
                                    <p className="text-sm text-blue-800/70">Latest Confidence</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-900">{reviewedScansCount}</p>
                                    <p className="text-sm text-green-800/70">Reviewed Scans</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader><CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-600"><History className="h-6 w-6" />Medical Imaging History</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cases.length > 0 ? (
                                    cases.map((scan) => (
                                        <div key={scan._id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">{getScanIcon(scan.scanType)}</div>
                                            <div className="flex-1">
                                                <div className="font-semibold flex items-center gap-2 capitalize">{scan.scanType}</div>
                                                <p className="text-sm text-gray-500">Uploaded on {new Date(scan.analysisDate).toLocaleDateString()}</p>
                                            </div>
                                            {getStatusBadge(scan.status)}
                                        </div>
                                    ))
                                ) : <p className="text-gray-500 text-center py-4">No imaging history found.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientProfilePage;