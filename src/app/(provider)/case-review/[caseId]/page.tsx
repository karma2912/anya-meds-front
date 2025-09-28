"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Send, FileText, Brain } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// This is the correct "flat" interface that matches your database document
interface CaseDetails {
    _id: string;
    patientName: string;
    patientId: string;
    analysisDate: string; // A Date object becomes a string in JSON
    scanType: string;
    primaryDiagnosis: string;
    confidenceScore: number;
    imageUrl: string;
    heatmapUrl: string;
    narrativeReport: string;
    status: 'pending' | 'completed';
}

const CaseReviewPage = () => {
    const params = useParams();
    const caseId = params.caseId as string;

    const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCaseDetails = async () => {
            if (!caseId) return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/provider/cases/${caseId}`);
                if (!response.ok) {
                    throw new Error('Case not found or failed to load.');
                }
                const data = await response.json();
                setCaseDetails(data);
            } catch (err: any) {
                console.error("Failed to fetch case details:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCaseDetails();
    }, [caseId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
    }

    if (error) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }
    
    if (!caseDetails) {
        return <div className="p-8 text-center">Case data is unavailable.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <PageHeader
                title={`Case Review: ${caseDetails._id}`}
                subtitle={`Analysis for ${caseDetails.patientName} (${caseDetails.patientId})`}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Left Column: Image Viewer */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4">
                    <h2 className="text-lg font-semibold mb-4">{caseDetails.scanType} - {new Date(caseDetails.analysisDate).toLocaleDateString()}</h2>
                    <div className="relative bg-black rounded-lg aspect-square">
                        {/* Base Image */}
                        <Image 
                            src={`http://localhost:5000${caseDetails.imageUrl}`} 
                            alt="Medical Scan" 
                            fill={true}
                            sizes="(max-width: 1024px) 90vw, 60vw"
                            className="object-contain" 
                        />
                        {/* Heatmap Overlay */}
                        <Image 
                            src={`http://localhost:5000${caseDetails.heatmapUrl}`}
                            alt="AI Heatmap"
                            fill={true}
                            sizes="(max-width: 1024px) 90vw, 60vw"
                            className="object-contain opacity-50 mix-blend-overlay"
                        />
                    </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="flex items-center text-lg font-semibold mb-4 border-b pb-2">
                            <Brain className="w-5 h-5 mr-2 text-blue-600" />
                            AI Analysis
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">AI Diagnosis</p>
                                <p className="text-xl font-bold text-blue-600">{caseDetails.primaryDiagnosis}</p>
                                <p className="text-sm text-gray-500">Confidence: {(caseDetails.confidenceScore * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">AI Narrative Summary</p>
                                <p className="text-sm text-gray-700 mt-1">{caseDetails.narrativeReport}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="flex items-center text-lg font-semibold mb-4 border-b pb-2">
                            <FileText className="w-5 h-5 mr-2 text-gray-700" />
                            Provider Review & Report
                        </h3>
                        <div className="space-y-4">
                           <div>
                                <Label htmlFor="providerNotes" className="text-sm font-medium">Your Notes & Final Diagnosis</Label>
                                <Textarea id="providerNotes" placeholder="Enter your findings, confirm or override AI diagnosis, and add recommendations..." className="mt-2" rows={6} />
                           </div>
                           <div className="flex flex-col sm:flex-row gap-2">
                                <Button className="w-full bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-2" />Confirm AI Diagnosis</Button>
                                <Button variant="secondary" className="w-full"><XCircle className="w-4 h-4 mr-2" />Override Diagnosis</Button>
                           </div>
                           <Button className="w-full"><Send className="w-4 h-4 mr-2" />Finalize & Send Report</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseReviewPage;