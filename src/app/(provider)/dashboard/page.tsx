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
import { Badge } from "@/components/ui/badge";

// --- UPDATED TYPE DEFINITIONS TO MATCH DATABASE ---
interface CaseItem {
    _id: string;
    patientName: string;
    patientId: string;
    scanType: string;
    primaryDiagnosis: string;
    confidenceScore: number;
    analysisDate: string;
    status: "pending" | "completed";
}

interface StatsData {
    totalPatients: number;
    totalAnalyses: number;
    pendingReviews: number;
    aiAccuracy: number;
}

// ============================================================================
// REUSABLE DASHBOARD COMPONENTS (Enhanced with original UI styling)
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
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch data from API (functionality from updated code)
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/provider/dashboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }
                const data = await response.json();
                setStats(data.stats);
                setCases(data.recentCases);
                setAnalyses(data.weeklyAnalyses);
            } catch (error) {
                console.error(error);
                // Optionally set an error state here to show a message to the user
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Filter cases based on search query
    const filteredCases = useMemo(() => {
        if (!searchQuery) return cases;
        
        const query = searchQuery.toLowerCase();
        return cases.filter(caseItem => 
            caseItem.patientName.toLowerCase().includes(query) ||
            caseItem.patientId.toLowerCase().includes(query) ||
            caseItem.scanType.toLowerCase().includes(query) ||
            caseItem.primaryDiagnosis.toLowerCase().includes(query)
        );
    }, [cases, searchQuery]);

    // Priority calculation based on confidence score and status (from original UI logic)
    const getPriority = (caseItem: CaseItem): "high" | "medium" | "low" => {
        if (caseItem.confidenceScore > 0.95) return "high";
        if (caseItem.confidenceScore > 0.85) return "medium";
        return "low";
    };

    const priorityBadge = (priority: "high" | "medium" | "low") => {
        const styles = {
            high: "bg-red-100 text-red-800",
            medium: "bg-yellow-100 text-yellow-800",
            low: "bg-green-100 text-green-800"
        };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority]}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>;
    };

    const scanTypeIcon = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes("chest")) return <HeartPulse className="w-5 h-5 text-blue-500" />;
        if (lowerType.includes("brain")) return <Brain className="w-5 h-5 text-purple-500" />;
        if (lowerType.includes("skin")) return <Bandage className="w-5 h-5 text-orange-500" />;
        return <Stethoscope className="w-5 h-5 text-gray-500" />;
    };

    // Calculate trend values for stats cards (from original UI)
    const getTrendValue = (title: string): { value: string; positive: boolean } => {
        switch (title) {
            case "Total Patients":
                return { value: "+12% from last month", positive: true };
            case "Analyses Performed":
                return { value: "+8% from last month", positive: true };
            case "Pending Reviews":
                return { value: "+2 from yesterday", positive: false };
            case "AI Accuracy":
                return { value: "+0.5% from last week", positive: true };
            default:
                return { value: "", positive: true };
        }
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

            {/* --- STATS CARDS (Original UI styling) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Patients" 
                    value={stats?.totalPatients ?? '...'} 
                    icon={Users} 
                    trendValue={getTrendValue("Total Patients").value}
                    trendPositive={getTrendValue("Total Patients").positive}
                />
                <StatCard 
                    title="Analyses Performed" 
                    value={stats?.totalAnalyses ?? '...'} 
                    icon={FileText} 
                    trendValue={getTrendValue("Analyses Performed").value}
                    trendPositive={getTrendValue("Analyses Performed").positive}
                />
                <StatCard 
                    title="Pending Reviews" 
                    value={stats?.pendingReviews ?? '...'} 
                    icon={AlertCircle} 
                    trendValue={getTrendValue("Pending Reviews").value}
                    trendPositive={getTrendValue("Pending Reviews").positive}
                />
                <StatCard 
                    title="AI Accuracy" 
                    value={stats ? `${stats.aiAccuracy}%` : '...'} 
                    icon={BarChart3} 
                    trendValue={getTrendValue("AI Accuracy").value}
                    trendPositive={getTrendValue("AI Accuracy").positive}
                />
            </div>

            {/* --- MAIN CONTENT GRID (Original UI styling) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- CASES TABLE (MAIN SECTION) --- */}
                <Card className="lg:col-span-2 rounded-2xl shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle className="text-lg font-semibold">Cases Awaiting Review</CardTitle>
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input 
                                    placeholder="Search cases..." 
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
                                ) : filteredCases.length > 0 ? (
                                    filteredCases.map((caseItem) => {
                                        const priority = getPriority(caseItem);
                                        return (
                                            <TableRow key={caseItem._id}>
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
                                                    <div className="text-sm text-gray-900">{caseItem.primaryDiagnosis}</div>
                                                    <div className="text-xs text-gray-500">{(caseItem.confidenceScore * 100).toFixed(1)}% confidence</div>
                                                </TableCell>
                                                <TableCell>{priorityBadge(priority)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => router.push(`/case-review/${caseItem._id}`)}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />Review
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            {searchQuery ? "No cases match your search." : "No cases found."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* --- SIDEBAR (Original UI styling) --- */}
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
                                onClick={() => router.push('/case-review')}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                View All Cases
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;