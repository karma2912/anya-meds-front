"use client";

import React, { useState, useEffect, useMemo, ElementType } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";
import {
  Bell,
  Search,
  Clock,
  User,
  Stethoscope,
  HeartPulse,
  Brain,
  Bandage,
  Eye,
  ChevronDown,
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
  Settings,
  LogOut,
  Plus,
  BarChart3,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/provider/PageHeader"; // Assuming PageHeader is in a separate component file

// --- TYPE DEFINITIONS ---
interface CaseItem {
  id: string; // Changed to string for more realistic IDs
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
// This data would normally come from your backend API calls
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
// These would typically be in their own files under `components/provider/`
// ============================================================================

// StatCard Component
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
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                </div>
                <div className={`p-2 rounded-lg ${iconColorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className={`text-xs ${trendPositive ? 'text-green-600' : 'text-red-600'} mt-2 flex items-center`}>
                <TrendingUp className="inline w-3 h-3 mr-1" />
                {trendValue}
            </p>
        </div>
    );
};

// AnalysesChart Component
const AnalysesChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Analyses This Week</h2>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                fontSize: "0.875rem",
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
            />
            <Line type="monotone" dataKey="analyses" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// TableSkeleton Component
const TableSkeleton: React.FC = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
        <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded-md w-24"></div></td>
      </tr>
    ))}
  </>
);

// EmptyState Component
const EmptyState: React.FC = () => (
  <tr>
    <td colSpan={5} className="text-center py-16">
      <div className="inline-flex flex-col items-center">
        <FileText className="w-12 h-12 text-gray-300 mb-2" />
        <h3 className="text-lg font-medium text-gray-700">No Cases Found</h3>
        <p className="text-sm text-gray-500">No cases match the current filter criteria.</p>
      </div>
    </td>
  </tr>
);

// ============================================================================
// MAIN DASHBOARD PAGE COMPONENT
// ============================================================================

const DashboardPage = () => {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- DATA FETCHING ---
  // This simulates fetching all necessary data when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      // In a real app, you would fetch from your API endpoints
      // For example:
      // const statsRes = await fetch('/api/provider/dashboard-stats');
      // const statsData = await statsRes.json();
      // const casesRes = await fetch('/api/provider/cases?status=pending');
      // const casesData = await casesRes.json();
      
      // Simulating network delay
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
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Patients" value={stats?.totalPatients ?? '...'} icon={Users} trendValue="+12% from last month" />
        <StatCard title="Analyses Performed" value={stats?.totalAnalyses ?? '...'} icon={FileText} trendValue="+8% from last month" />
        <StatCard title="Pending Reviews" value={stats?.pendingReviews ?? '...'} icon={AlertCircle} trendValue="+2 from yesterday" trendPositive={false} />
        <StatCard title="AI Accuracy" value={stats ? `${stats.aiAccuracy}%` : '...'} icon={BarChart3} trendValue="+0.5% from last week" />
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- CASES TABLE (MAIN SECTION) --- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Cases Awaiting Review</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scan Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <TableSkeleton />
                  ) : cases.length > 0 ? (
                    cases.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{caseItem.patientName}</div>
                          <div className="text-sm text-gray-500">{caseItem.patientId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {scanTypeIcon(caseItem.scanType)}
                            <span className="ml-2 text-sm text-gray-900">{caseItem.scanType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{caseItem.aiResult}</div>
                          <div className="text-xs text-gray-500">{caseItem.confidence}% confidence</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{priorityBadge(caseItem.priority)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" onClick={() => router.push(`/case-review/${caseItem.id}`)}>
                            <Eye className="w-4 h-4 mr-1" />Review
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- ANALYSES CHART (SIDEBAR) --- */}
        <div className="lg:col-span-1">
          <AnalysesChart data={analyses} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;