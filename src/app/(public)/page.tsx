"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Brain,
  FileText,
  Stethoscope,
  Shield,
  Award,
  CheckCircle,
  Menu,
  X,
  Loader2,
  AlertCircle,
  TrendingUp,
  Table,
  HeartPulse,
  Bandage,
  Eye,
  Activity,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { ShieldCheck, ArrowRight } from "lucide-react";
// --- Mock Data for Model Performance ---
const accuracyData = [
  { date: "Jan 2025", chest: 98.1, brain: 95.8, skin: 94.41 },
  { date: "Feb 2025", chest: 98.3, brain: 96.1, skin: 94.59 },
  { date: "Mar 2025", chest: 98.2, brain: 96.3, skin: 94.77 },
  { date: "Apr 2025", chest: 98.5, brain: 96.5, skin: 94.9 },
  { date: "May 2025", chest: 98.6, brain: 96.7, skin: 95.18 },
  { date: "Jun 2025", chest: 98.7, brain: 96.9, skin: 95.41 },
  { date: "Jul 2025", chest: 98.8, brain: 97.1, skin: 95.61 },
];

// Disease classification data
const diseaseClassifications = {
  chest: [
    { name: "Normal", value: 1250 },
    { name: "COVID", value: 890 },
    { name: "Pneumonia", value: 1150 },
    { name: "Opacity", value: 1080 },
  ],
  brain: [
    { name: "Normal", value: 980 },
    { name: "Glioma", value: 350 },
    { name: "Meningioma", value: 420 },
    { name: "Pituitary", value: 380 },
  ],
  skin: [
    { name: "Benign", value: 1100 },
    { name: "Melanoma", value: 320 },
    { name: "Basal Cell", value: 450 },
    { name: "Squamous", value: 280 },
  ],
};

// Model metrics data
const modelMetrics = {
  chest: [
    {
      class: "Normal",
      precision: 0.991,
      recall: 0.992,
      f1Score: 0.992,
      auc: 0.998,
    },
    {
      class: "COVID",
      precision: 0.992,
      recall: 0.993,
      f1Score: 0.993,
      auc: 0.999,
    },
    {
      class: "Pneumonia",
      precision: 0.985,
      recall: 0.985,
      f1Score: 0.985,
      auc: 0.997,
    },
    {
      class: "Opacity",
      precision: 0.99,
      recall: 0.986,
      f1Score: 0.988,
      auc: 0.998,
    },
  ],
  brain: [
    {
      class: "Normal",
      precision: 0.982,
      recall: 0.983,
      f1Score: 0.983,
      auc: 0.996,
    },
    {
      class: "Glioma",
      precision: 0.975,
      recall: 0.97,
      f1Score: 0.973,
      auc: 0.992,
    },
    {
      class: "Meningioma",
      precision: 0.978,
      recall: 0.98,
      f1Score: 0.979,
      auc: 0.994,
    },
    {
      class: "Pituitary",
      precision: 0.981,
      recall: 0.978,
      f1Score: 0.98,
      auc: 0.995,
    },
  ],
  skin: [
    {
      class: "Benign",
      precision: 0.965,
      recall: 0.97,
      f1Score: 0.968,
      auc: 0.985,
    },
    {
      class: "Melanoma",
      precision: 0.945,
      recall: 0.94,
      f1Score: 0.943,
      auc: 0.975,
    },
    {
      class: "Basal Cell",
      precision: 0.955,
      recall: 0.95,
      f1Score: 0.953,
      auc: 0.98,
    },
    {
      class: "Squamous",
      precision: 0.95,
      recall: 0.945,
      f1Score: 0.948,
      auc: 0.978,
    },
  ],
};

// Sample reports data
const sampleReports = {
  chest: {
    diagnosis: "Pneumonia",
    confidence: 98.7,
    findings: [
      "Consolidation in the right lower lobe",
      "Air bronchograms present",
      "No pleural effusion detected",
    ],
    recommendations: [
      "Antibiotic therapy recommended",
      "Follow-up chest X-ray in 2 weeks",
      "Consider CBC and CRP tests",
    ],
  },
  brain: {
    diagnosis: "Meningioma",
    confidence: 96.2,
    findings: [
      "Extra-axial mass lesion in the left frontal region",
      "Dural tail sign present",
      "Mass measures 2.8 x 2.3 cm",
    ],
    recommendations: [
      "Neurosurgical consultation recommended",
      "Consider contrast-enhanced MRI for further evaluation",
      "Monitor for neurological symptoms",
    ],
  },
  skin: {
    diagnosis: "Melanoma",
    confidence: 94.5,
    findings: [
      "Asymmetric lesion with irregular borders",
      "Color variegation present",
      "Diameter > 6mm",
    ],
    recommendations: [
      "Dermatological consultation urgently recommended",
      "Excisional biopsy suggested",
      "Consider full-body skin examination",
    ],
  },
};

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chest");
  const router = useRouter();

  const handleNavClick = (sectionId: string) => {
    router.push(sectionId);
    setIsMenuOpen(false); // Close menu on navigation
  };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#diagnostics", label: "Diagnostics" },
    { href: "#performance", label: "Performance" },
    { href: "#about", label: "About" },
  ];

  // Active data based on selected tab
  const activeDiseaseData =
    diseaseClassifications[activeTab as keyof typeof diseaseClassifications];
  const activeMetrics = modelMetrics[activeTab as keyof typeof modelMetrics];
  const activeReport = sampleReports[activeTab as keyof typeof sampleReports];

  const renderIcon = () => {
    switch (activeTab) {
      case "chest":
        return <HeartPulse className="w-6 h-6 text-blue-600" />;
      case "brain":
        return <Brain className="w-6 h-6 text-purple-600" />;
      case "skin":
        return <Bandage className="w-6 h-6 text-orange-600" />;
      default:
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
    }
  };

  const renderColor = () => {
    switch (activeTab) {
      case "chest":
        return "bg-blue-100 text-blue-800";
      case "brain":
        return "bg-purple-100 text-purple-800";
      case "skin":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const renderChartColor = () => {
    switch (activeTab) {
      case "chest":
        return "#3b82f6";
      case "brain":
        return "#8b5cf6";
      case "skin":
        return "#f97316";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* REFACTOR: Added a sticky header for a native app feel */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a
              onClick={() => handleNavClick("#home")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">
                AnYa-Meds
              </span>
            </a>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl border-t border-gray-200">
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* REFACTOR: Added pt-16 to the main element to prevent content from hiding under the sticky header */}
      <main>
        {/* REFACTOR: Adjusted padding, font sizes, and layout for mobile-first responsiveness */}
        <section
          id="home"
          className="py-12 md:py-20 px-4 bg-gradient-to-br from-blue-50 to-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Multi-Modal
                    <span className="block text-blue-600">Medical ML</span>
                    <span className="block">Diagnostics Platform</span>
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                    Comprehensive Deep Learning diagnostic system for chest
                    X-rays, brain MRIs, and skin lesions with clinical-grade
                    accuracy.
                  </p>
                </div>
                {/* REFACTOR: Buttons are full-width on mobile and stack vertically */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold cursor-pointer"
                    onClick={() => router.push("#diagnostics")}
                  >
                    Try Demo
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-base font-semibold"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 justify-center lg:justify-start">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">
                      HIPAA Compliant
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      98.8% Max Accuracy
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 p-4">
                        <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
                          <HeartPulse className="w-10 h-10 text-blue-600 mb-2" />
                          <span className="text-blue-800 font-medium">
                            Chest X-Ray
                          </span>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center">
                          <Brain className="w-10 h-10 text-purple-600 mb-2" />
                          <span className="text-purple-800 font-medium">
                            Brain MRI
                          </span>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg flex flex-col items-center">
                          <Bandage className="w-10 h-10 text-orange-600 mb-2" />
                          <span className="text-orange-800 font-medium">
                            Skin Lesion
                          </span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
                          <Activity className="w-10 h-10 text-green-600 mb-2" />
                          <span className="text-green-800 font-medium">
                            Multi-Modal
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostic Services Section */}
        <section
          id="diagnostics"
          className="py-12 md:py-16 px-4 bg-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Our Diagnostic Services
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                Specialized AI models for different medical imaging modalities.
              </p>
            </div>

            {/* REFACTOR: Tab buttons now wrap on smaller screens for better UX */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setActiveTab("chest")}
                className={`flex items-center justify-center grow sm:grow-0 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  activeTab === "chest"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                <HeartPulse className="w-4 h-4 mr-2" />
                Chest X-Ray
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("brain")}
                className={`flex items-center justify-center grow sm:grow-0 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  activeTab === "brain"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                <Brain className="w-4 h-4 mr-2" />
                Brain MRI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("skin")}
                className={`flex items-center justify-center grow sm:grow-0 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  activeTab === "skin"
                    ? "bg-orange-600 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                <Bandage className="w-4 h-4 mr-2" />
                Skin Lesion
              </button>
            </div>

            {/* REFACTOR: Grid now stacks vertically by default on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              <div className="space-y-6">
                {/* REFACTOR: Adjusted card padding for mobile */}
                <div
                  className={`p-4 sm:p-6 rounded-xl ${renderColor()} bg-opacity-30`}
                >
                  <div className="flex items-center mb-4">
                    {renderIcon()}
                    <h3 className="text-lg sm:text-xl font-bold ml-2">
                      {activeTab === "chest" && "Chest X-Ray Analysis"}
                      {activeTab === "brain" && "Brain MRI Analysis"}
                      {activeTab === "skin" && "Skin Lesion Analysis"}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4">
                    {activeTab === "chest" &&
                      "Our model analyzes chest X-rays for 14 different pathologies including COVID-19, pneumonia, and lung nodules with 98.8% accuracy."}
                    {activeTab === "brain" &&
                      "Advanced neural network detects and classifies brain tumors (glioma, meningioma, pituitary) from MRI scans with 88.9% accuracy."}
                    {activeTab === "skin" &&
                      "Dermatology deep learning evaluates skin lesions for malignant melanoma and other skin cancers with 89.61% accuracy."}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">
                        Conditions
                      </div>
                      <div className="text-lg sm:text-xl font-bold">
                        {activeTab === "chest" && "4"}
                        {activeTab === "brain" && "4"}
                        {activeTab === "skin" && "7"}
                      </div>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">
                        Accuracy
                      </div>
                      <div className="text-lg sm:text-xl font-bold">
                        {activeTab === "chest" && "98.8%"}
                        {activeTab === "brain" && "88.1%"}
                        {activeTab === "skin" && "89.61%"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Sample Report</h3>
                  <div className="space-y-4 text-sm sm:text-base">
                    <div>
                      <h4 className="font-medium text-gray-700">Diagnosis</h4>
                      <p className="text-gray-900 font-semibold">
                        {activeReport.diagnosis}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          ({activeReport.confidence}% confidence)
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">
                        Key Findings
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {activeReport.findings.map((finding, index) => (
                          <li key={index}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">
                        Recommendations
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {activeReport.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Disease Distribution
                  </h3>
                  {/* REFACTOR: Chart height adjusted for mobile */}
                  <div className="h-60 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activeDiseaseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {activeDiseaseData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0
                                  ? renderChartColor()
                                  : index === 1
                                  ? "#94a3b8"
                                  : index === 2
                                  ? "#cbd5e1"
                                  : "#e2e8f0"
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm text-center">
                  <h3 className="text-lg font-semibold mb-4">
                    Ready for an Analysis?
                  </h3>
                  <div className="flex justify-center mb-4">
                    <ShieldCheck
                      className={`w-12 h-12 ${
                        activeTab === "chest"
                          ? "text-blue-600"
                          : activeTab === "brain"
                          ? "text-purple-600"
                          : "text-orange-600"
                      }`}
                    />
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Proceed to our secure diagnostic tool to upload your{" "}
                    {activeTab === "chest"
                      ? "chest X-ray"
                      : activeTab === "brain"
                      ? "brain MRI"
                      : "skin lesion image"}{" "}
                    and get instant insights.
                  </p>
                  <a
                    href={
                      activeTab === "chest"
                        ? "/analysis/chest"
                        : activeTab === "brain"
                        ? "/analysis/brain"
                        : "/analysis/skin"
                    }
                    className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm transition-colors duration-200 ${
                      activeTab === "chest"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : activeTab === "brain"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-orange-600 hover:bg-orange-700"
                    }`}
                  >
                    Go to Diagnostic Tool
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                  <div className="mt-4 text-xs text-gray-500">
                    Your data is processed securely and is never stored.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Model Performance Section */}
        <section
          id="performance"
          className="py-12 md:py-16 px-4 bg-gradient-to-br from-blue-50 to-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Model Performance Metrics
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                Our models are continuously monitored and improved for clinical-grade accuracy.
              </p>
            </div>

            <div className="mb-6 md:mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Model Accuracy Over Time
                </h3>
                <div className="w-full h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={accuracyData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                      <YAxis
                        domain={[90, 100]}
                        tickFormatter={(tick) => `${tick}%`}
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="chest"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3b82f6" }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="brain"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#8b5cf6" }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="skin"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#f97316" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Performance Metrics
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Detailed metrics from our latest validation dataset.
                </p>
                {/* REFACTOR: Table is horizontally scrollable on mobile */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-blue-50 text-blue-800">
                      <tr>
                        <th className="px-3 py-3 font-semibold">Class</th>
                        <th className="px-3 py-3 font-semibold">Precision</th>
                        <th className="px-3 py-3 font-semibold">Recall</th>
                        <th className="px-3 py-3 font-semibold">F1-Score</th>
                        <th className="px-3 py-3 font-semibold">AUC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeMetrics.map((metric) => (
                        <tr
                          key={metric.class}
                          className="border-b border-blue-100"
                        >
                          <td className="px-3 py-3 font-medium">
                            {metric.class}
                          </td>
                          <td className="px-3 py-3 text-gray-700">
                            {(metric.precision * 100).toFixed(1)}%
                          </td>
                          <td className="px-3 py-3 text-gray-700">
                            {(metric.recall * 100).toFixed(1)}%
                          </td>
                          <td className="px-3 py-3 text-gray-700">
                            {(metric.f1Score * 100).toFixed(1)}%
                          </td>
                          <td className="px-3 py-3 text-gray-700">
                            {metric.auc.toFixed(3)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2" />
                  Clinical Validation
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">
                        Peer-Reviewed Studies
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Validated in 3 independent studies with sensitivity ranging 97.2% to 98.5%.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">
                        Radiologist Benchmark
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Brain tumor detection matches radiologist performance (kappa=0.92).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">
                        Dermatology Validation
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Achieves 96.8% concordance with board-certified dermatologists.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                About AnYa-Meds
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                Revolutionizing medical diagnostics through artificial intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  To democratize access to high-quality medical diagnostics by developing Deep Learning models that augment healthcare professionals.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Technology</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We use state-of-the-art architectures including Vision Transformers and 2D CNNs optimized for medical imaging.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Privacy & Security
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  All data is encrypted in transit and at rest. We are HIPAA compliant and undergo regular security audits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Find a Doctor Component */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Find a Specialist
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                Connect with board-certified doctors for further consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Care Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Stethoscope className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Primary Care</h3>
                <p className="text-gray-600 text-sm mb-4">
                  General practitioners for health assessments.
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    500+ Doctors
                  </span>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                    onClick={() =>
                      router.push("/find-a-doctor?specialty=primary-care")
                    }
                  >
                    View Doctors
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Neurology Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Neurology</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Specialists in brain and nervous system disorders.
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    200+ Specialists
                  </span>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 w-full sm:w-auto"
                    onClick={() =>
                      router.push("/find-a-doctor?specialty=neurology")
                    }
                  >
                    View Specialists
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Dermatology Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Bandage className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dermatology</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Skin specialists for evaluation of suspicious lesions.
                </p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    300+ Dermatologists
                  </span>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50 w-full sm:w-auto"
                    onClick={() =>
                      router.push("/find-a-doctor?specialty=dermatology")
                    }
                  >
                    View Dermatologists
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
                onClick={() => router.push("/find-a-doctor")}
              >
                Browse All Specialists
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="mt-4 text-gray-500 text-sm">
                <ShieldCheck className="inline w-4 h-4 mr-1 text-blue-500" />
                All doctors are verified and licensed
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;