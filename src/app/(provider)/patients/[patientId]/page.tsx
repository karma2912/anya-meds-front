"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Mars, Venus, VenusAndMars } from "lucide-react";

import {
    AlertTriangle, User, Mail, FileText, Download, BrainCircuit, HeartPulse, Scan,
    History, FileDown, Stethoscope, ShieldCheck
} from "lucide-react";

type Patient = {
    _id: string;
    id: string;
    name: string;
    part: string;
    gender: string;
    email: string;
    phone: string;
    avatarUrl?: string;
};

const summarySnapshot = {
    latestDiagnosis: "Benign Nevus",
    confidence: 92,
    lastScanDate: "2025-08-15",
    priority: "High",
    priorityReason: "Atypical lesion detected, requires dermatologist review.",
};

const imagingHistory = [
    { id: "IMG-003", type: "Skin Lesion", date: "2025-08-15", status: "Reviewed", thumbnailUrl: "https://placehold.co/100x100/e2e8f0/475569?text=Skin" },
    { id: "IMG-002", type: "Chest X-ray", date: "2025-06-20", status: "Analyzed", thumbnailUrl: "https://placehold.co/100x100/e2e8f0/475569?text=Chest" },
    { id: "IMG-001", type: "Brain MRI", date: "2025-02-10", status: "Analyzed", thumbnailUrl: "https://placehold.co/100x100/e2e8f0/475569?text=Brain" },
];

const PatientProfilePage = () => {
    const params = useParams();
    const patientId = params.patientId as string;

    const [patient, setPatient] = useState<Patient | null>(null);
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
                    throw new Error('Patient not found.');
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
            case "reviewed": return <Badge variant="default" className="bg-green-100 text-green-800">Reviewed</Badge>;
            case "analyzed": return <Badge variant="secondary">Analyzed</Badge>;
            case "pending": return <Badge variant="outline">Pending</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getScanIcon = (type: string) => {
        if (type.includes("Brain")) return <BrainCircuit className="h-5 w-5 text-blue-500" />;
        if (type.includes("Chest")) return <HeartPulse className="h-5 w-5 text-blue-500" />;
        if (type.includes("Skin")) return <Scan className="h-5 w-5 text-blue-500" />;
        return <FileText className="h-5 w-5 text-blue-500" />;
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
    }

    if (error || !patient) {
        return <div className="p-8 text-center text-red-500">{error || "Patient data could not be loaded."}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Patient Profile</h1>
                        <p className="text-gray-600 mt-1">View and manage patient information and medical imaging data</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <FileDown className="h-4 w-4" />
                            PDF Report
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export Data
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Left Column - Patient Information */}
                    <div className="lg:col-span-1 space-y-6 lg:space-y-8">
                        {/* Patient Profile Card */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <Avatar className="h-24 w-24 border-2 border-blue-100">
                                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                        <AvatarFallback className="bg-blue-50 text-blue-600">
                                            <User className="h-10 w-10" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
                                        <p className="text-gray-600 mt-1">Patient ID: {patient.id}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Download className="h-5 w-5 text-blue-600" />
                                    Reports & Exports
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <Button variant="outline" className="justify-start">
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Generate PDF Report
                                </Button>
                                <Button variant="outline" className="justify-start">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Images (ZIP)
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle Column - Medical Information */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        {/* Patient Details Card */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-gray-800">Patient Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-semibold">{patient.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Stethoscope className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Body Part</p>
                                            <p className="font-semibold">{patient.part}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Patient ID (MRN)</p>
                                            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded-md">{patient.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {patient.gender === "Male" && (
                                            <><Mars className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="font-semibold">{patient.gender || 'N/A'}</p>
                                            </div></>
                                        )}
                                        {patient.gender === "Female" && (
                                            <><Venus className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="font-semibold">{patient.gender || 'N/A'}</p>
                                            </div></>
                                        )}
                                        {patient.gender === "Other" && (
                                            <><VenusAndMars className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="font-semibold">{patient.gender || 'N/A'}</p>
                                            </div></>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 md:col-span-2">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-semibold">{patient.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary Snapshot Card */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-600">
                                    <ShieldCheck className="h-6 w-6" />
                                    Summary Snapshot
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800/70">Latest AI Diagnosis</p>
                                        <p className="text-xl font-bold text-blue-900">{summarySnapshot.latestDiagnosis}</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800/70">Confidence Score</p>
                                        <p className="text-xl font-bold text-blue-900">{summarySnapshot.confidence}%</p>
                                    </div>
                                </div>
                                {summarySnapshot.priority === "High" && (
                                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle className="font-bold">High Priority Finding</AlertTitle>
                                        <AlertDescription>{summarySnapshot.priorityReason}</AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Additional Information */}
                    <div className="lg:col-span-1 space-y-6 lg:space-y-8">
                        {/* Status Overview Card */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-gray-800">Status Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Scans</span>
                                    <Badge variant="secondary">{imagingHistory.length}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Reviewed</span>
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                        {imagingHistory.filter(s => s.status === 'Reviewed').length}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Analyzed</span>
                                    <Badge variant="secondary">
                                        {imagingHistory.filter(s => s.status === 'Analyzed').length}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Last Update</span>
                                    <span className="text-sm font-semibold">{summarySnapshot.lastScanDate}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats Card */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-gray-800">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-900">{summarySnapshot.confidence}%</p>
                                    <p className="text-sm text-blue-800/70">AI Confidence</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-900">
                                        {imagingHistory.filter(s => s.status === 'Reviewed').length}
                                    </p>
                                    <p className="text-sm text-green-800/70">Reviewed Scans</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Medical Imaging History - Full Width */}
                <div className="lg:col-span-4">
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-600">
                                <History className="h-6 w-6" />
                                Medical Imaging History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {imagingHistory.map((scan) => (
                                    <div key={scan.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <img src={scan.thumbnailUrl} alt={scan.type} className="h-16 w-16 rounded-md object-cover bg-gray-200" />
                                        <div className="flex-1">
                                            <div className="font-semibold flex items-center gap-2">
                                                {getScanIcon(scan.type)} {scan.type}
                                            </div>
                                            <p className="text-sm text-gray-500">Uploaded on {scan.date}</p>
                                        </div>
                                        {getStatusBadge(scan.status)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientProfilePage;