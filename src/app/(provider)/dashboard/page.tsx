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
  Calendar,
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
  CheckCircle,
  XCircle,
  Download,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Plus,
  BarChart3,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
interface CaseItem {
  id: number;
  patientName: string;
  patientId: string;
  scanType: string;
  aiResult: string;
  confidence: number;
  uploadDate: string;
  status: "pending" | "completed" | "rejected";
  priority: "high" | "medium" | "low";
}

interface PatientUpdate {
  id: number;
  patientName: string;
  action: string;
  time: string;
  type: string;
}

interface StatsData {
  totalPatients: number;
  totalAnalyses: number;
  pendingReviews: number;
  aiAccuracy: number;
}

// --- MOCK DATA ---
const casesAwaitingReview: CaseItem[] = [
    { id: 1, patientName: "Sarah Johnson", patientId: "P-48291", scanType: "Chest X-Ray", aiResult: "Pneumonia detected", confidence: 98.7, uploadDate: "2025-08-18", status: "pending", priority: "high" },
    { id: 2, patientName: "Michael Chen", patientId: "P-57123", scanType: "Brain MRI", aiResult: "Meningioma suspected", confidence: 96.2, uploadDate: "2025-08-17", status: "pending", priority: "medium" },
    { id: 3, patientName: "Emma Williams", patientId: "P-34982", scanType: "Skin Lesion", aiResult: "Melanoma detected", confidence: 94.5, uploadDate: "2025-08-17", status: "pending", priority: "high" },
    { id: 4, patientName: "Robert Davis", patientId: "P-67234", scanType: "Chest X-Ray", aiResult: "Normal findings", confidence: 99.1, uploadDate: "2025-08-16", status: "pending", priority: "low" },
    { id: 5, patientName: "Lisa Rodriguez", patientId: "P-18923", scanType: "Brain MRI", aiResult: "Glioma detected", confidence: 95.8, uploadDate: "2025-08-16", status: "pending", priority: "high" }
];
const recentPatientUpdates: PatientUpdate[] = [
    { id: 1, patientName: "James Wilson", action: "New brain MRI uploaded", time: "2 hours ago", type: "upload" },
    { id: 2, patientName: "Patricia Brown", action: "New patient registered", time: "4 hours ago", type: "registration" },
    { id: 3, patientName: "John Miller", action: "Chest X-Ray results ready", time: "5 hours ago", type: "results" },
];
const statsData: StatsData = { totalPatients: 1248, totalAnalyses: 3752, pendingReviews: 12, aiAccuracy: 98.8 };
const analysesData = [
    { day: "Mon", analyses: 22 }, { day: "Tue", analyses: 35 }, { day: "Wed", analyses: 42 },
    { day: "Thu", analyses: 38 }, { day: "Fri", analyses: 51 }, { day: "Sat", analyses: 45 },
    { day: "Sun", analyses: 30 },
];

// ============================================================================
// REFACTORED & NEW COMPONENTS
// ============================================================================

// 1. ProviderNavbar Component
const ProviderNavbar: React.FC = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-blue-900">AnYa-Meds</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="relative">
          <button className="flex items-center space-x-2" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Dr. Smith</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User className="w-4 h-4 mr-2" />Profile</a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Settings className="w-4 h-4 mr-2" />Settings</a>
              <div className="border-t border-gray-200 my-1"></div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><LogOut className="w-4 h-4 mr-2" />Sign out</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// 2. StatCard Component
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


// 3. AnalysesChart Component
const AnalysesChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState("Weekly");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Analyses Over Time</h2>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button size="sm" onClick={() => setTimeRange("Weekly")} variant={timeRange === "Weekly" ? "default" : "ghost"} className="bg-blue-600 text-white">Weekly</Button>
          <Button size="sm" onClick={() => setTimeRange("Monthly")} variant={timeRange === "Monthly" ? "default" : "ghost"} className="bg-blue-600 text-white">Monthly</Button>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={analysesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                fontSize: "0.875rem",
              }}
            />
            <Line dataKey="analyses" fill="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 4. TableSkeleton Component
const TableSkeleton: React.FC = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="ml-4 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div></td>
        <td className="px-6 py-4"><div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div></td>
      </tr>
    ))}
  </>
);

// 5. EmptyState Component
const EmptyState: React.FC = () => (
  <tr>
    <td colSpan={6} className="text-center py-16">
      <div className="inline-flex flex-col items-center">
        <FileText className="w-12 h-12 text-gray-300 mb-2" />
        <h3 className="text-lg font-medium text-gray-700">No Cases Found</h3>
        <p className="text-sm text-gray-500">No cases match the current filter criteria.</p>
      </div>
    </td>
  </tr>
);


// ============================================================================
// MAIN DASHBOARD COMPONENT (Updated)
// ============================================================================

const ProviderDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const filteredCases = useMemo(() => {
    return casesAwaitingReview
      .filter(caseItem => {
        if (priorityFilter === "all") return true;
        return caseItem.priority === priorityFilter;
      })
      .filter(caseItem => {
        const query = searchQuery.toLowerCase();
        return (
          caseItem.patientName.toLowerCase().includes(query) ||
          caseItem.patientId.toLowerCase().includes(query)
        );
      });
  }, [searchQuery, priorityFilter]);

  const priorityBadge = (priority: "high" | "medium" | "low") => {
    const styles = { high: "bg-red-100 text-red-800", medium: "bg-yellow-100 text-yellow-800", low: "bg-green-100 text-green-800" };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>;
  };

  const scanTypeIcon = (type: string) => {
    if (type.includes("Chest")) return <HeartPulse className="w-4 h-4 text-blue-500" />;
    if (type.includes("Brain")) return <Brain className="w-4 h-4 text-purple-500" />;
    if (type.includes("Skin")) return <Bandage className="w-4 h-4 text-orange-500" />;
    return <Stethoscope className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNavbar />
      <main className="px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Clinical Dashboard</h1>
          <div className="flex space-x-2">
             <Button className="bg-blue-600 hover:bg-blue-700">
               <Plus className="w-4 h-4 mr-2" />
               New Patient
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard title="Total Patients" value={statsData.totalPatients} icon={Users} trendValue="+12% from last month" />
          <StatCard title="Analyses Performed" value={statsData.totalAnalyses} icon={FileText} trendValue="+8% from last month" />
          <StatCard title="Pending Reviews" value={statsData.pendingReviews} icon={AlertCircle} trendValue="+2 from yesterday" trendPositive={false} />
          <StatCard title="AI Accuracy" value={`${statsData.aiAccuracy}%`} icon={BarChart3} trendValue="+0.5% from last week" />
        </div>

        <AnalysesChart />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Cases Awaiting Review</h2>
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" placeholder="Search cases..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div className="flex space-x-2 border-b border-gray-200 -mx-6 px-6">
                  {(["all", "high", "medium", "low"] as const).map(p => (
                    <button key={p} onClick={() => setPriorityFilter(p)} className={`capitalize px-3 py-2 text-sm font-medium ${priorityFilter === p ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      {p}
                    </button>
                  ))}
                </div>
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
                    ) : filteredCases.length > 0 ? (
                      filteredCases.map((caseItem) => (
                        <tr key={caseItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-blue-600" /></div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{caseItem.patientName}</div><div className="text-sm text-gray-500">{caseItem.patientId}</div></div></div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center">{scanTypeIcon(caseItem.scanType)}<span className="ml-2 text-sm text-gray-900">{caseItem.scanType}</span></div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{caseItem.aiResult}</div><div className="text-xs text-gray-500">{caseItem.confidence}% confidence</div></td>
                          <td className="px-6 py-4 whitespace-nowrap">{priorityBadge(caseItem.priority)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/case-review/${caseItem.id}`)}><Eye className="w-4 h-4 mr-1" />Review</Button></td>
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
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4"><h2 className="text-lg font-semibold text-gray-900">Recent Updates</h2></div>
              <div className="divide-y divide-gray-200">
                {recentPatientUpdates.map((update) => (
                  <div key={update.id} className="px-6 py-4 hover:bg-gray-50"><div className="flex items-start"><div className="flex-shrink-0"><div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-gray-600" /></div></div><div className="ml-3 flex-1"><p className="text-sm font-medium text-gray-900">{update.patientName}</p><p className="text-sm text-gray-500">{update.action}</p><p className="text-xs text-gray-400 mt-1"><Clock className="inline w-3 h-3 mr-1" />{update.time}</p></div></div></div>
                ))}
              </div>
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50"><button className="text-sm text-blue-600 font-medium">View all activity</button></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;