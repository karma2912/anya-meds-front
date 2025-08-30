"use client";

import React, { useState, useEffect, useMemo, ElementType } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
} from "recharts";
import {
    Upload,
    Eye,
    TrendingUp,
    Users,
    FileText,
    AlertCircle,
    BarChart3,
    Search,
    HeartPulse,
    Brain,
    Bandage,
    Stethoscope,
    ArrowUpRight,
    User
} from "lucide-react";
import { PageHeader } from "@/components/provider/PageHeader";

// --- TYPE DEFINITIONS ---
interface CaseItem {
    id: string;
    patientName: string;
    patientId: string;
    scanType: string;
    aiResult: string;
    confidence: number;
    uploadDate: string;
    status: "pending" | "completed" | "rejected";
    priority: "high" | "medium" | "low";
}

interface StatsData {
    totalPatients: number;
    totalAnalyses: number;
    pendingReviews: number;
    aiAccuracy: number;
}

// --- MOCK API DATA ---
const mockCases: CaseItem[] = [
    { id: "c-a4b1", patientName: "Sarah Johnson", patientId: "P-48291", scanType: "Chest X-Ray", aiResult: "Pneumonia detected", confidence: 98.7, uploadDate: "2025-08-18", status: "pending", priority: "high" },
    { id: "c-b2c3", patientName: "Michael Chen", patientId: "P-57123", scanType: "Brain MRI", aiResult: "Meningioma suspected", confidence: 96.2, uploadDate: "2025-08-17", status: "pending", priority: "medium" },
    { id: "c-d4e5", patientName: "Emma Williams", patientId: "P-34982", scanType: "Skin Lesion", aiResult: "Melanoma detected", confidence: 94.5, uploadDate: "2025-08-17", status: "pending", priority: "high" },
    { id: "c-f6g7", patientName: "Robert Davis", patientId: "P-67234", scanType: "Chest X-Ray", aiResult: "Normal findings", confidence: 99.1, uploadDate: "2025-08-16", status: "pending", priority: "low" },
    { id: "c-h8i9", patientName: "Lisa Rodriguez", patientId: "P-18923", scanType: "Brain MRI", aiResult: "Glioma detected", confidence: 95.8, uploadDate: "2025-08-16", status: "pending", priority: "high" }
];
const mockStatsData: StatsData = { totalPatients: 1248, totalAnalyses: 3752, pendingReviews: 12, aiAccuracy: 98.8 };
const mockAnalysesData = [
    { day: "Mon", analyses: 22 }, { day: "Tue", analyses: 35 }, { day: "Wed", analyses: 42 },
    { day: "Thu", analyses: 38 }, { day: "Fri", analyses: 51 }, { day: "Sat", analyses: 45 },
    { day: "Sun", analyses: 30 },
];

// ============================================================================
// REUSABLE DASHBOARD COMPONENTS
// ============================================================================

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ElementType;
    trendValue: string;
    trendPositive?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trendValue, trendPositive = true }) => {
    const iconColorClass = {
        "Total Patients": "bg-blue-100 text-blue-600",
        "Analyses Performed": "bg-purple-100 text-purple-600",
        "Pending Reviews": "bg-amber-100 text-amber-600",
        "AI Accuracy": "bg-green-100 text-green-600",
    }[title] || "bg-gray-100 text-gray-600";

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${iconColorClass}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <p className={`text-xs ${trendPositive ? 'text-green-600' : 'text-red-600'} mt-1 flex items-center`}>
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    {trendValue}
                </p>
            </CardContent>
        </Card>
    );
};

const AnalysesChart: React.FC<{ data: any[] }> = ({ data }) => {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Analyses This Week</CardTitle>
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 text-xs">
                        View report <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="h-72 w-full pt-4">
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "0.75rem",
                                border: "1px solid #e5e7eb",
                                fontSize: "0.875rem",
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="analyses"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'white' }}
                            activeDot={{ r: 6, fill: '#2563eb' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

// ============================================================================
// MAIN DASHBOARD PAGE COMPONENT
// ============================================================================

const DashboardPage = () => {
    const router = useRouter();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [cases, setCases] = useState<CaseItem[]>([]);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setStats(mockStatsData);
            setCases(mockCases);
            setAnalyses(mockAnalysesData);
            setIsLoading(false);
        };
        fetchDashboardData();
    }, []);

    const priorityBadge = (priority: "high" | "medium" | "low") => {
        const styles = {
            high: "bg-red-100 text-red-800",
            medium: "bg-yellow-100 text-yellow-800",
            low: "bg-green-100 text-green-800"
        };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority]}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>;
    };

    const scanTypeIcon = (type: string) => {
        if (type.includes("Chest")) return <HeartPulse className="w-5 h-5 text-blue-500" />;
        if (type.includes("Brain")) return <Brain className="w-5 h-5 text-purple-500" />;
        if (type.includes("Skin")) return <Bandage className="w-5 h-5 text-orange-500" />;
        return <Stethoscope className="w-5 h-5 text-gray-500" />;
    };

    return (
        <div className="h-full w-full p-4 sm:p-6 lg:p-8 space-y-6">
            <PageHeader
                title="Clinical Dashboard"
                subtitle="Overview of your patient analyses and pending tasks."
                actionButton={{
                    label: "New Analysis",
                    icon: Upload,
                    onClick: () => router.push('/analysis/new')
                }}
            />

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Patients" value={stats?.totalPatients ?? '...'} icon={Users} trendValue="+12% from last month" />
                <StatCard title="Analyses Performed" value={stats?.totalAnalyses ?? '...'} icon={FileText} trendValue="+8% from last month" />
                <StatCard title="Pending Reviews" value={stats?.pendingReviews ?? '...'} icon={AlertCircle} trendValue="+2 from yesterday" trendPositive={false} />
                <StatCard title="AI Accuracy" value={stats ? `${stats.aiAccuracy}%` : '...'} icon={BarChart3} trendValue="+0.5% from last week" />
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- CASES TABLE (MAIN SECTION) --- */}
                <Card className="lg:col-span-2 rounded-2xl shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-lg font-semibold">Cases Awaiting Review</CardTitle>
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input placeholder="Search cases..." className="pl-10" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Scan Type</TableHead>
                                    <TableHead>AI Result</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <TableRow key={i} className="animate-pulse">
                                            <TableCell><div className="h-4 bg-gray-200 rounded w-3/4"></div></TableCell>
                                            <TableCell><div className="h-4 bg-gray-200 rounded w-1/2"></div></TableCell>
                                            <TableCell><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                                            <TableCell><div className="h-6 bg-gray-200 rounded-full w-20"></div></TableCell>
                                            <TableCell className="text-right"><div className="h-8 bg-gray-200 rounded-md w-24"></div></TableCell>
                                        </TableRow>
                                    ))
                                ) : cases.length > 0 ? (
                                    cases.map((caseItem) => (
                                        <TableRow key={caseItem.id}>
                                            <TableCell className="font-medium">
                                                <div className="font-semibold text-gray-900">{caseItem.patientName}</div>
                                                <div className="text-sm text-gray-500">{caseItem.patientId}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {scanTypeIcon(caseItem.scanType)}
                                                    <span className="text-sm">{caseItem.scanType}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-gray-900">{caseItem.aiResult}</div>
                                                <div className="text-xs text-gray-500">{caseItem.confidence}% confidence</div>
                                            </TableCell>
                                            <TableCell>{priorityBadge(caseItem.priority)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.push(`/case-review/${caseItem.id}`)}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No cases found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* --- SIDEBAR --- */}
                <div className="space-y-6">
                    <AnalysesChart data={analyses} />
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Button
                                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                                onClick={() => router.push('/patients/new')}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Add Patient
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50"
                                onClick={() => router.push('/patients')}
                            >
                                <User className="w-4 h-4 mr-2" />
                                View Patients
                            </Button>
                             <Button
                                variant="outline"
                                className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50"
                                onClick={() => router.push('/reports')}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Generate Reports
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;