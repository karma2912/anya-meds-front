// In: app/(provider)/patients/[patientId]/page.tsx

"use client"; // FIX 1: Convert the page to a Client Component

import React, { useState, useEffect, ElementType } from "react";
import { useParams } from 'next/navigation'; // FIX 2: Import useParams to get the ID from the URL
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

import {
    AlertTriangle, User, Cake, Phone, Mail, FileText, Download, BrainCircuit, HeartPulse, Scan,
    History, FileDown, Upload, Stethoscope, Save, ClipboardPlus, Activity, ShieldCheck
} from "lucide-react";

// FIX 3: Define a more accurate type for a single patient document from MongoDB
type Patient = {
    _id: string;
    id: string;
    name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    avatarUrl?: string;
};

// --- Mock Data (can be used for other sections or fallbacks) ---
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

const diagnosisResults = [
    {
        scanId: "IMG-003",
        predictions: [
            { condition: "Benign Nevus", confidence: 92, risk: "clear" },
            { condition: "Melanoma", confidence: 5, risk: "high-risk" },
            { condition: "Seborrheic Keratosis", confidence: 3, risk: "uncertain" },
        ],
        heatmapUrl: "https://placehold.co/300x200/000000/ffffff?text=Grad-CAM+Heatmap",
    },
];

const medicalHistory = [
    { title: "Past Diagnoses", items: ["Mild Asthma", "Iron Deficiency Anemia"] },
    { title: "Ongoing Treatments", items: ["Albuterol Inhaler (as-needed)", "Ferrous Sulfate supplements"] },
    { title: "Risk Factors", items: ["Family history of skin cancer", "Fair skin type"] },
];

const activityLog = [
    { action: "Final diagnosis updated by Dr. Anya Sharma", timestamp: "2 hours ago", icon: Stethoscope },
    { action: "AI analysis completed for IMG-003", timestamp: "1 day ago", icon: ShieldCheck },
    { action: "New skin lesion image uploaded", timestamp: "1 day ago", icon: Upload },
    { action: "Patient record created", timestamp: "6 months ago", icon: ClipboardPlus },
];


const PatientProfilePage = () => {
    const params = useParams();
    const patientId = params.patientId as string;

    // FIX 4: State should hold a single Patient object, not an array
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!patientId) return;

        const fetchPatientDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // FIX 5: Fetch a SINGLE patient using the correct API endpoint
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

    const getRiskBadge = (risk: string) => {
        switch (risk.toLowerCase()) {
            case "clear": return <Badge variant="default" className="bg-green-100 text-green-800">Clear</Badge>;
            case "uncertain": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Uncertain</Badge>;
            case "high-risk": return <Badge variant="destructive">High Risk</Badge>;
            default: return <Badge variant="secondary">{risk}</Badge>;
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
        <div className="h-full w-full p-4 sm:p-6 lg:p-8 bg-gray-50/50">
            <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* --- MAIN CONTENT (LEFT AND MIDDLE) --- */}
                <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
                    {/* 1. Patient Info Card */}
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-800">Patient Information</CardTitle>
                        </CardHeader>
                        {/* FIX 6: Use the `patient` state object to display data */}
                        <CardContent className="flex flex-col sm:flex-row items-start gap-6">
                            <Avatar className="h-24 w-24 border-2 border-blue-100">
                                <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                <AvatarFallback className="bg-blue-50 text-blue-600">
                                    <User className="h-10 w-10" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-semibold">{patient.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Cake className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">DOB & Gender</p>
                                        <p className="font-semibold">{patient.dob}, {patient.gender}</p>
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
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-semibold">{patient.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:col-span-2">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold">{patient.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Summary Snapshot Card */}
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

                    {/* 3. Medical Imaging History */}
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
                    
                    {/* 4. AI Diagnosis & 5. Doctor Interpretation (Combined Card) */}
                    <Card className="rounded-2xl shadow-sm">
                         <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-600">
                                <Stethoscope className="h-6 w-6" />
                                Analysis & Interpretation (IMG-003)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* AI Diagnosis Results Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-700">AI Diagnosis Results</h3>
                                <img src={diagnosisResults[0].heatmapUrl} alt="Heatmap" className="w-full rounded-lg border" />
                                <div className="space-y-2">
                                    {diagnosisResults[0].predictions.map((pred) => (
                                        <div key={pred.condition} className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium">{pred.condition}</p>
                                            <div className="flex items-center gap-2 w-1/2">
                                                <Progress value={pred.confidence} className="h-2" />
                                                <span className="text-sm font-semibold w-10 text-right">{pred.confidence}%</span>
                                                {getRiskBadge(pred.risk)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Doctor Interpretation Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-700">Doctor's Interpretation</h3>
                                <div className="space-y-1.5">
                                    <Label htmlFor="final-diagnosis">Final Diagnosis</Label>
                                    <Select defaultValue="benign-nevus">
                                        <SelectTrigger id="final-diagnosis"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="benign-nevus">Benign Nevus</SelectItem>
                                            <SelectItem value="melanoma">Melanoma</SelectItem>
                                            <SelectItem value="other">Other Condition</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="doctor-notes">Clinical Notes</Label>
                                    <Textarea id="doctor-notes" placeholder="Add your notes here..." className="min-h-[120px]" defaultValue="Lesion appears symmetric with regular borders. Consistent with AI's primary finding of a benign nevus. No immediate action required." />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="recommendations">Recommendations</Label>
                                    <Textarea id="recommendations" placeholder="Add recommendations..." className="min-h-[80px]" defaultValue="Recommend annual skin check-up. Patient advised to monitor for any changes in size, shape, or color."/>
                                </div>
                                <div className="flex justify-end">
                                    <Button><Save className="h-4 w-4 mr-2" />Save Interpretation</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* --- SIDEBAR (RIGHT) --- */}
                <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8">
                    {/* 6. Patient Medical History */}
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ClipboardPlus className="h-5 w-5 text-blue-600" />
                                Medical History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {medicalHistory.map((section) => (
                                <div key={section.title}>
                                    <h4 className="font-semibold text-gray-700 mb-2">{section.title}</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                        {section.items.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    {/* 7. Reports & Exports */}
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Download className="h-5 w-5 text-blue-600" />
                                Reports & Exports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Button variant="outline"><FileDown className="h-4 w-4 mr-2" />Generate PDF Report</Button>
                            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Download Images (ZIP)</Button>
                        </CardContent>
                    </Card>

                    {/* 8. Activity Timeline */}
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600" />
                                Activity Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative pl-6">
                                {/* Vertical line */}
                                <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200" />
                                <div className="space-y-6">
                                    {activityLog.map((activity, index) => (
                                        <div key={index} className="relative flex items-start gap-3">
                                            <div className="absolute left-[-24px] top-1.5 flex items-center justify-center h-5 w-5 bg-white rounded-full">
                                                <div className="h-4 w-4 bg-blue-100 rounded-full flex items-center justify-center">
                                                     <activity.icon className="h-2.5 w-2.5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                                                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientProfilePage;