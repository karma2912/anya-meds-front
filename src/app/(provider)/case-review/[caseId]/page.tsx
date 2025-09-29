'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  HeartPulse, 
  Calendar, 
  User, 
  FileText, 
  Share2, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Download,
  Clock,
  Activity,
  BarChart3,
  Thermometer,
  Bandage
} from 'lucide-react';
import Image from 'next/image';

// --- CORRECTED INTERFACE ---
// This interface matches the actual "flat" data structure from your backend
interface CaseAnalysis {
  _id: string;
  patientName: string;
  patientId: string;
  analysisDate: string;
  scanType: string;
  primaryDiagnosis: string;
  confidenceScore: number;
  narrativeReport: string;
  imageUrl: string;
  heatmapUrl: string;
  status: 'pending' | 'completed' | 'error';
}

export default function CaseReviewPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.6); // Default to 60%

  useEffect(() => {
    const fetchCaseAnalysis = async () => {
      if (!caseId) return;
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/provider/cases/${caseId}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Case not found' : `Failed to fetch: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCaseAnalysis();
  }, [caseId]);

  // --- Action Handlers ---
  const handleFinalizeReport = async () => console.log('Finalizing report...');
  const handleShareWithColleague = () => navigator.clipboard.writeText(window.location.href);
  const handleDownloadReport = () => console.log('Downloading report...');
  const handleBackToDashboard = () => router.push('/dashboard');

  // --- UI Helper Functions ---
  const getScanTypeIcon = (scanType: string) => {
    const st = scanType.toLowerCase();
    if (st.includes('brain')) return <Brain className="h-4 w-4 text-purple-600" />;
    if (st.includes('chest')) return <HeartPulse className="h-4 w-4 text-blue-600" />;
    if (st.includes('skin')) return <Bandage className="h-4 w-4 text-orange-600" />;
    return <FileText className="h-4 w-4 text-gray-600" />;
  };
  
  const getSeverityBadge = (confidence: number) => {
    if (confidence > 0.9) return <Badge variant="destructive">High Confidence</Badge>;
    if (confidence > 0.75) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Confidence</Badge>;
    return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Low Confidence</Badge>;
  };

  if (isLoading) return <CaseReviewSkeleton />;

  if (error || !analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6">
        <Card className="max-w-md w-full text-center p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <CardTitle className="text-2xl mb-2">Analysis Not Found</CardTitle>
          <CardDescription className="mb-6">{error || "The requested case could not be loaded."}</CardDescription>
          <Button onClick={handleBackToDashboard}><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:px-8 lg:py-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Case Review</h1>
            <p className="text-lg text-gray-500 mt-1">
              AI-powered analysis for <span className="font-medium text-gray-700">{analysis.patientName}</span>
            </p>
          </div>
          <Badge variant={analysis.status === 'completed' ? 'default' : 'secondary'} className="px-3 py-1.5 text-sm capitalize">
            <Clock className="h-4 w-4 mr-2" />{analysis.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {getScanTypeIcon(analysis.scanType)}
                  Medical Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-100 rounded-lg p-2.5">
                    <label htmlFor="opacity-slider" className="text-sm font-medium text-gray-700">Heatmap Opacity</label>
                    <div className="flex items-center gap-3">
                      <input id="opacity-slider" type="range" min="0" max="100" value={heatmapOpacity * 100} onChange={(e) => setHeatmapOpacity(Number(e.target.value) / 100)} className="w-32 accent-blue-600"/>
                      <span className="text-sm text-gray-600 w-10 text-right">{Math.round(heatmapOpacity * 100)}%</span>
                    </div>
                  </div>
                  <div className="relative bg-black rounded-lg overflow-hidden border aspect-square">
                      <Image src={`http://localhost:5000${analysis.imageUrl}`} alt="Medical scan" fill className="object-contain"/>
                      <Image src={`http://localhost:5000${analysis.heatmapUrl}`} alt="AI heatmap overlay" fill className="object-contain mix-blend-overlay" style={{ opacity: heatmapOpacity }}/>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><FileText className="h-5 w-5 text-blue-600" />AI Narrative Report</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed">
                  <p>{analysis.narrativeReport}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3"><Brain className="h-5 w-5 text-green-600" />AI Findings Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Primary Diagnosis</p>
                    {getSeverityBadge(analysis.confidenceScore)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analysis.primaryDiagnosis}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Confidence Score</p>
                  <div className="flex items-center gap-4">
                    <Progress value={analysis.confidenceScore * 100} className="h-2"/>
                    <span className="text-xl font-semibold text-gray-800">{(analysis.confidenceScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader><CardTitle>Case Details</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-gray-500 flex items-center gap-2"><User className="h-4 w-4" />Patient Name</span><span className="font-medium text-gray-800">{analysis.patientName}</span></div>
                  <Separator />
                  <div className="flex items-center justify-between"><span className="text-gray-500 flex items-center gap-2"><User className="h-4 w-4" />Patient ID</span><span className="font-mono text-gray-800">{analysis.patientId}</span></div>
                  <Separator />
                  <div className="flex items-center justify-between"><span className="text-gray-500 flex items-center gap-2"><Calendar className="h-4 w-4" />Analysis Date</span><span className="font-medium text-gray-800">{new Date(analysis.analysisDate).toLocaleDateString()}</span></div>
                  <Separator />
                  <div className="flex items-center justify-between"><span className="text-gray-500 flex items-center gap-2">{getScanTypeIcon(analysis.scanType)} Scan Type</span><span className="font-medium text-gray-800">{analysis.scanType}</span></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader><CardTitle>Report Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                  <Button onClick={handleFinalizeReport} size="lg" className="w-full bg-blue-600 hover:bg-blue-700" disabled={analysis.status === 'completed'}><CheckCircle2 className="h-5 w-5 mr-2" />Finalize Report</Button>
                  <Button onClick={handleDownloadReport} size="lg" variant="outline" className="w-full"><Download className="h-5 w-5 mr-2" />Download Report</Button>
                  <Button onClick={handleShareWithColleague} size="lg" variant="outline" className="w-full"><Share2 className="h-5 w-5 mr-2" />Share with Colleague</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SKELETON LOADER ---
function CaseReviewSkeleton() {
  const SkeletonBlock = ({ className }: { className?: string }) => <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />;

  return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-screen-xl mx-auto">
              <div className="mb-8">
                  <SkeletonBlock className="h-6 w-32 mb-4" />
                  <SkeletonBlock className="h-10 w-1/2 mb-2" />
                  <SkeletonBlock className="h-6 w-1/3" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3 space-y-8">
                      <Card className="shadow-sm"><CardHeader><SkeletonBlock className="h-6 w-48" /></CardHeader><CardContent><SkeletonBlock className="h-12 w-full my-4" /><SkeletonBlock className="aspect-square w-full" /></CardContent></Card>
                      <Card className="shadow-sm"><CardHeader><SkeletonBlock className="h-6 w-40" /></CardHeader><CardContent><SkeletonBlock className="h-24 w-full" /></CardContent></Card>
                  </div>
                  <div className="lg:col-span-2 space-y-8">
                      <Card className="shadow-sm"><CardHeader><SkeletonBlock className="h-6 w-48" /></CardHeader><CardContent className="space-y-6"><SkeletonBlock className="h-8 w-3/4" /><SkeletonBlock className="h-6 w-full" /></CardContent></Card>
                      <Card className="shadow-sm"><CardHeader><SkeletonBlock className="h-6 w-32" /></CardHeader><CardContent className="space-y-4"><SkeletonBlock className="h-6 w-full" /><SkeletonBlock className="h-6 w-full" /><SkeletonBlock className="h-6 w-full" /></CardContent></Card>
                      <Card className="shadow-sm"><CardHeader><SkeletonBlock className="h-6 w-36" /></CardHeader><CardContent className="space-y-3"><SkeletonBlock className="h-12 w-full" /><SkeletonBlock className="h-12 w-full" /><SkeletonBlock className="h-12 w-full" /></CardContent></Card>
                  </div>
              </div>
          </div>
      </div>
  );
}