"use client";
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Download, Send, User, Calendar, Shield } from 'lucide-react';
import { Label } from '@radix-ui/react-label';

// Mock data type, replace with your actual type
type CaseDetails = any;

const CaseReviewPage = ({ params }: { params: { caseId: string } }) => {
    const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCaseDetails = async () => {
            setIsLoading(true);
            const response = await fetch(`/api/provider/cases/${params.caseId}`);
            const data = await response.json();
            setCaseDetails(data);
            setIsLoading(false);
        };
        fetchCaseDetails();
    }, [params.caseId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
    }

    if (!caseDetails) {
        return <div>Case not found.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader 
                title={`Case Review: ${caseDetails.id}`}
                subtitle={`Analysis for ${caseDetails.patient.name} (${caseDetails.patient.id})`}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                <Label className="text-xs font-semibold text-gray-500">AI DIAGNOSIS</Label>
                                <p className="text-xl font-bold text-blue-600">{caseDetails.aiAnalysis.diagnosis}</p>
                                <p className="text-sm text-gray-500">Confidence: {caseDetails.aiAnalysis.confidence}%</p>
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-gray-500">KEY FINDINGS</Label>
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
                                <Label htmlFor="providerNotes">Your Notes & Final Diagnosis</Label>
                                <Textarea id="providerNotes" placeholder="Enter your findings, confirm or override AI diagnosis, and add recommendations..." rows={6} />
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