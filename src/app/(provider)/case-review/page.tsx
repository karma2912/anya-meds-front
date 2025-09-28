// In: app/case-review/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/provider/PageHeader';
import { Loader2, Search, Brain, HeartPulse, Bandage, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define the type for a single case in the list
interface Case {
    _id: string;
    patientName: string;
    scanType: string;
    primaryDiagnosis: string;
    analysisDate: string;
    status: 'pending' | 'completed';
}

const AllCasesPage = () => {
    const router = useRouter();
    const [cases, setCases] = useState<Case[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAllCases = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // We will create this new API endpoint in the next step
                const response = await fetch('/api/provider/cases');
                if (!response.ok) {
                    throw new Error('Failed to fetch cases.');
                }
                const data = await response.json();
                setCases(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllCases();
    }, []);

    const filteredCases = useMemo(() => {
        if (!searchQuery) return cases;
        return cases.filter(c => 
            c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [cases, searchQuery]);

    const getScanTypeIcon = (scanType: string) => {
        if (scanType.toLowerCase().includes('chest')) return <HeartPulse className="w-5 h-5 text-blue-500" />;
        if (scanType.toLowerCase().includes('brain')) return <Brain className="w-5 h-5 text-purple-500" />;
        if (scanType.toLowerCase().includes('skin')) return <Bandage className="w-5 h-5 text-orange-500" />;
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <PageHeader
                title="Case Review History"
                subtitle="Browse and review all past AI analyses."
            />

            <Card className="mt-6">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <CardTitle>All Analyses</CardTitle>
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search by patient or diagnosis..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Scan Type</TableHead>
                                <TableHead>AI Diagnosis</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredCases.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        No cases found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCases.map(c => (
                                    <TableRow key={c._id}>
                                        <TableCell className="font-medium">{c.patientName}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getScanTypeIcon(c.scanType)}
                                                <span>{c.scanType}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{c.primaryDiagnosis}</TableCell>
                                        <TableCell>{new Date(c.analysisDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={c.status === 'completed' ? 'default' : 'secondary'}>
                                                {c.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/case-review/${c._id}`)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AllCasesPage;