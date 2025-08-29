"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';

type CaseDetails = any;

const CaseReviewPage = () => {
    const params = useParams();
    const caseId = params.caseId as string;

    const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Add a dedicated state for errors
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCaseDetails = async () => {
            if (!caseId) return;

            setIsLoading(true);
            setError(null); // Reset error on new fetch

            try {
                const response = await fetch(`/api/provider/cases/${caseId}`);
                
                // FIX 1: Check if the response was successful (not a 404, etc.)
                if (!response.ok) {
                    throw new Error('Case not found.');
                }
                
                const data = await response.json();
                setCaseDetails(data);

            } catch (err: any) {
                console.error("Failed to fetch case details:", err);
                setError(err.message);
                setCaseDetails(null); // Ensure details are null on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchCaseDetails();
    }, [caseId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
    }

    // FIX 2: Show an error message if the fetch failed
    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    }
    
    // This check now correctly handles when data is not found
    if (!caseDetails) {
        return <div className="p-8 text-center">Case data is unavailable.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <PageHeader
                title={`Case Review: ${caseDetails.id}`}
                subtitle={`Analysis for ${caseDetails.patient.name} (${caseDetails.patient.id})`}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Left Column: Image Viewer */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{caseDetails.scan.type} - {caseDetails.scan.date}</h2>
                    <div className="bg-black rounded-lg flex items-center justify-center aspect-square">
                        <img src={caseDetails.scan.imageUrl} alt="Medical Scan" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">AI Analysis</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500">AI DIAGNOSIS</p>
                                <p className="text-xl font-bold text-blue-600">{caseDetails.aiAnalysis.diagnosis}</p>
                                <p className="text-sm text-gray-500">Confidence: {caseDetails.aiAnalysis.confidence}%</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500">KEY FINDINGS</p>
                                <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                                    {caseDetails.aiAnalysis.findings.map((f: string, i: number) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Provider Review & Report</h3>
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