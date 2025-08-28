"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/provider/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Search, Loader2 } from 'lucide-react';

type Patient = { id: string; name: string; dob: string; lastScan: string; lastScanDate: string; };

const PatientsPage = () => {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await fetch('/api/provider/patients');
            const data = await res.json();
            setPatients(data);
            setIsLoading(false);
        };
        fetchPatients();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader
                title="Patients"
                subtitle="Manage patient records and view their analysis history."
                actionButton={{
                    label: "Add New Patient",
                    icon: UserPlus,
                    onClick: () => router.push('/patients/new')
                }}
            />
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b">
                     <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input placeholder="Search patients by name or ID..." className="pl-10" />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Patient ID</TableHead>
                            <TableHead>Date of Birth</TableHead>
                            <TableHead>Last Scan</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></TableCell></TableRow>
                        ) : (
                            patients.map(patient => (
                                <TableRow key={patient.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell>{patient.id}</TableCell>
                                    <TableCell>{patient.dob}</TableCell>
                                    <TableCell>{patient.lastScan} on {patient.lastScanDate}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/patients/${patient.id}`)}>
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
    );
};
export default PatientsPage;