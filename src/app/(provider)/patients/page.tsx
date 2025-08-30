"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Search, Loader2, User, Calendar, Scan } from 'lucide-react';

type Patient = { id: string; name: string; dob: string; lastScan: string; lastScanDate: string; avatarUrl: string; };

const PatientsPage = () => {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await fetch('/api/provider/patients');
            const data = await res.json();
            setPatients(data);
            setIsLoading(false);
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <PageHeader
                title="Patient Records"
                subtitle="Manage patient records and view their analysis history."
                actionButton={{
                    label: "Add New Patient",
                    icon: UserPlus,
                    onClick: () => router.push('/patients/new')
                }}
            />
            
            <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden mt-6">
                <div className="p-5 border-b border-blue-100 bg-blue-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-600" />
                            Patient Directory
                        </h3>
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input 
                                placeholder="Search patients by name or ID..." 
                                className="pl-10 border-blue-200 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-700 py-4 pl-6">Patient Name</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-4">Patient ID</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-4">Date of Birth</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-4">Last Scan</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-4 text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={5} className="text-center h-64">
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                                            <p className="text-gray-500">Loading patient records...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredPatients.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={5} className="text-center h-64">
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <User className="w-10 h-10 text-gray-300 mb-3" />
                                            <p className="text-gray-500">
                                                {searchQuery ? 'No patients match your search' : 'No patient records found'}
                                            </p>
                                            {searchQuery && (
                                                <Button 
                                                    variant="outline" 
                                                    className="mt-3 border-blue-200 text-blue-600"
                                                    onClick={() => setSearchQuery('')}
                                                >
                                                    Clear search
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPatients.map(patient => (
                                    <TableRow key={patient.id} className="hover:bg-blue-50 border-t border-blue-100">
                                        <TableCell className="font-medium pl-6 py-4">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                {patient.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 py-4">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm font-mono">
                                                {patient.id}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-600 py-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                {patient.dob}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {patient.lastScan ? (
                                                <div className="flex items-center">
                                                    <Scan className="w-4 h-4 mr-1 text-blue-500" />
                                                    <span className="font-medium">{patient.lastScan}</span>
                                                    <span className="text-gray-500 text-sm ml-1">on {patient.lastScanDate}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No scans yet</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-4">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => router.push(`/patients/${patient.id}`)}
                                                className="border-blue-200 text-blue-600 hover:bg-blue-100"
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
            </div>
        </div>
    );
};
export default PatientsPage;