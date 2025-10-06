// In: app/(provider)/patients/page.tsx

"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Search, Loader2, User, Scan, AlertTriangle, Stethoscope, HeartPulse, Brain, Bandage } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


// FIX 1: Update the Patient type to match the data structure from MongoDB
type Patient = {
    _id: string; // MongoDB's unique identifier, used for React keys
    id: string;  // The user-friendly ID you created (e.g., p-123456)
    name: string;
    part: string;
    lastScan: string;
    lastScanDate: string;
};

const PatientsPage = () => {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    // FIX 2: Add state to handle potential API errors
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/provider/patients');
                if (!res.ok) {
                    // If the API returns an error, capture it
                    throw new Error("Failed to fetch patient data from the server.");
                }
                const data = await res.json();
                setPatients(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        (patient.name && patient.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (patient.id && patient.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // The UI structure is the same, just wrapped in Card components for consistency
    return (
        <div className="h-full w-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Patient Records"
                    subtitle="Manage patient records and view their analysis history."
                    actionButton={{
                        label: "Add New Patient",
                        icon: UserPlus,
                        onClick: () => router.push('/patients/new')
                    }}
                />
                
                {/* Display any API errors to the user */}
                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                <Card className="rounded-xl shadow-md mt-6">
                    <CardHeader className="p-5 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                Patient Directory
                            </CardTitle>
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by name or ID..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Patient Name</TableHead>
                                        <TableHead>Patient ID</TableHead>
                                        <TableHead>Body Part</TableHead>
                                        <TableHead>Last Scan</TableHead>
                                        <TableHead className="text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-64">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                                                    <p className="font-medium text-gray-500">Loading patient records...</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredPatients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-64">
                                                <div className="flex flex-col items-center justify-center">
                                                    <User className="w-10 h-10 text-gray-300 mb-3" />
                                                    <p className="font-semibold text-gray-600">No Patients Found</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {searchQuery ? 'No records match your search.' : 'Click "Add New Patient" to begin.'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPatients.map(patient => (
                                            // FIX 3: Use `patient._id` as the unique key, which is a React best practice
                                            <TableRow key={patient._id}>
                                                <TableCell className="font-medium pl-6">
                                                    <div className="flex items-center">
                                                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        {patient.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm font-mono">
                                                        {patient.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {patient.part == "Chest" && (<>
                                                     <div className="flex items-center text-gray-600">
                                                        <HeartPulse className="w-4 h-4 mr-2 text-gray-400" />
                                                        {patient.part}
                                                    </div>
                                                    </>)}
                                                    {patient.part == "Brain" && (<>
                                                     <div className="flex items-center text-gray-600">
                                                        <Brain className="w-4 h-4 mr-2 text-gray-400" />
                                                        {patient.part}
                                                    </div>
                                                    </>)}
                                                    {patient.part == "Skin" && (<>
                                                     <div className="flex items-center text-gray-600">
                                                        <Bandage className="w-4 h-4 mr-2 text-gray-400" />
                                                        {patient.part}
                                                    </div>
                                                    </>)}
                                                   
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <Scan className="w-4 h-4 mr-2 text-blue-500" />
                                                        <div>
                                                            <div className="font-medium">{patient.lastScan}</div>
                                                            {patient.lastScanDate && <div className="text-xs text-gray-500">on {patient.lastScanDate}</div>}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.push(`/patients/${patient._id}`)}
                                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        View Profile
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PatientsPage;