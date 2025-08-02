"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
} from "recharts";

// --- Mock Data for Model Performance ---
const accuracyData = [
  { date: "Jan 2025", accuracy: 98.1 },
  { date: "Feb 2025", accuracy: 98.3 },
  { date: "Mar 2025", accuracy: 98.2 },
  { date: "Apr 2025", accuracy: 98.5 },
  { date: "May 2025", accuracy: 98.6 },
  { date: "Jun 2025", accuracy: 98.7 },
  { date: "Jul 2025", accuracy: 98.8 },
];

const confusionMatrixData = [
  // Predicted ->
  // Actual V
  //            Normal, COVID, Pneumonia, Opacity
  { name: "Normal", values: [1250, 2, 5, 3] },
  { name: "COVID", values: [1, 890, 4, 1] },
  { name: "Pneumonia", values: [6, 3, 1150, 8] },
  { name: "Opacity", values: [4, 2, 9, 1080] },
];
const classLabels = ["Normal", "COVID", "Pneumonia", "Opacity"];

const classMetricsData = [
  { class: "Normal", precision: 0.991, recall: 0.992, f1Score: 0.992, auc: 0.998 },
  { class: "COVID", precision: 0.992, recall: 0.993, f1Score: 0.993, auc: 0.999 },
  { class: "Pneumonia", precision: 0.985, recall: 0.985, f1Score: 0.985, auc: 0.997 },
  { class: "Opacity", precision: 0.990, recall: 0.986, f1Score: 0.988, auc: 0.998 },
];

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState < File | null > (null);
  const [predictionResult, setPredictionResult] = useState < any | null > (null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState < string | null > (null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPredictionResult(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Something went wrong during prediction."
        );
      }
      const data = await response.json();
      setPredictionResult(data);
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-14">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-900">AnYa-Med</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#research" className="text-gray-700 hover:text-blue-600 transition-colors">Research</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Sign In
              </Button>
            </div>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (<X className="w-6 h-6" />) : (<Menu className="w-6 h-6" />)}
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-100">
              <div className="flex flex-col space-y-3">
                <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
                <a href="#research" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Research</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-fit">
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="py-12 md:py-20 px-4 sm:px-6 lg:px-14">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    AI-Powered
                    <span className="block text-blue-600">Chest X-Ray</span>
                    <span className="block">Diagnosis</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                    Revolutionary medical diagnostic system that analyzes chest
                    X-rays with 98.5%+ accuracy, detecting COVID-19, Pneumonia, Lung
                    Opacity, and other critical conditions instantly.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg cursor-pointer" onClick={() => router.push("/diagnosis")}>
                    Try Demo
                  </Button>
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                    Learn More
                  </Button>
                </div>
                <div className="flex items-center space-x-6 pt-4 justify-center lg:justify-start">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">98.5%+ Accuracy</span>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Stethoscope className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Chest X-Ray Analysis</p>
                        <p className="text-sm text-gray-500">AI-Powered Diagnosis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Summary Card */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="text-2xl text-center text-blue-900">
                  AnYa-Med Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6"><h3 className="text-lg font-semibold text-gray-900 mb-2">Project Name</h3><p className="text-gray-600">AnYa-Med (by Yash and Anam)</p><div><h3 className="text-lg font-semibold text-gray-900 mb-2">Purpose</h3><p className="text-gray-600">AI-powered chest X-ray diagnosis system designed to assist healthcare professionals in rapid and accurate medical imaging analysis.</p></div></div>
                  <div className="space-y-6"><div><h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3><ul className="space-y-2"><li className="flex items-center text-gray-600"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />COVID-19 Detection</li><li className="flex items-center text-gray-600"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Pneumonia Identification</li><li className="flex items-center text-gray-600"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />Lung Opacity Analysis</li><li className="flex items-center text-gray-600"><CheckCircle className="w-4 h-4 text-green-600 mr-2" />NIH Disease Detection</li></ul></div><div><h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy</h3><p className="text-gray-600"><span className="text-2xl font-bold text-blue-600">98.5%+</span>{" "}accuracy on validation set</p></div></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How AnYa-Med Works</h2><p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Our AI-powered diagnostic system provides accurate results in three simple steps</p></div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow"><CardHeader className="text-center pb-4"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Upload className="w-8 h-8 text-blue-600" /></div><CardTitle className="text-xl text-blue-900">Upload Image</CardTitle></CardHeader><CardContent className="text-center"><p className="text-gray-600">Securely upload chest X-ray images through our HIPAA-compliant platform.</p></CardContent></Card>
              <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow"><CardHeader className="text-center pb-4"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Brain className="w-8 h-8 text-blue-600" /></div><CardTitle className="text-xl text-blue-900">AI Analysis</CardTitle></CardHeader><CardContent className="text-center"><p className="text-gray-600">Our advanced neural network analyzes the X-ray using state-of-the-art deep learning algorithms.</p></CardContent></Card>
              <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow"><CardHeader className="text-center pb-4"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-blue-600" /></div><CardTitle className="text-xl text-blue-900">Get Report</CardTitle></CardHeader><CardContent className="text-center"><p className="text-gray-600">Receive a comprehensive diagnostic report with confidence scores and key findings.</p></CardContent></Card>
            </div>
          </div>
        </section>

        {/* Model Performance & Validation Section */}
        <section id="research" className="py-20 px-4 sm:px-6 lg:px-14 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16"><h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Model Performance & Validation</h2><p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">Our model is rigorously tested and continuously monitored to ensure the highest level of accuracy and reliability.</p></div>
            <div className="mb-8">
              <Card className="border-blue-200 shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2 text-blue-900"><TrendingUp className="w-6 h-6" />Model Accuracy Over Time</CardTitle></CardHeader>
                <CardContent>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={accuracyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis domain={[97, 99]} tickFormatter={(tick) => `${tick}%`} stroke="#6b7280"/>
                        <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "0.5rem" }}/>
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" stroke="#2563eb" strokeWidth={2} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-blue-200 shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2 text-blue-900"><Award className="w-6 h-6" />Performance Metrics</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">Detailed metrics for each diagnostic category based on our latest validation dataset.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm sm:text-base">
                      <thead className="bg-blue-50 text-blue-800">
                        <tr>
                          <th className="px-2 py-3 sm:p-3 font-semibold">Class</th>
                          <th className="px-2 py-3 sm:p-3 font-semibold">Precision</th>
                          <th className="px-2 py-3 sm:p-3 font-semibold">Recall</th>
                          <th className="px-2 py-3 sm:p-3 font-semibold">F1-Score</th>
                          <th className="px-2 py-3 sm:p-3 font-semibold">AUC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classMetricsData.map((metric) => (
                          <tr key={metric.class} className="border-b border-blue-100">
                            <td className="px-2 py-3 sm:p-3 font-medium">{metric.class}</td>
                            <td className="px-2 py-3 sm:p-3 text-gray-700">{(metric.precision * 100).toFixed(1)}%</td>
                            <td className="px-2 py-3 sm:p-3 text-gray-700">{(metric.recall * 100).toFixed(1)}%</td>
                            <td className="px-2 py-3 sm:p-3 text-gray-700">{(metric.f1Score * 100).toFixed(1)}%</td>
                            <td className="px-2 py-3 sm:p-3 text-gray-700">{metric.auc.toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-blue-200 shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2 text-blue-900"><Table className="w-6 h-6" />Confusion Matrix</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-500">Actual vs. Predicted values. Correct predictions are on the diagonal.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr>
                          <th className="p-2 border border-blue-200 bg-blue-50"><span className="text-[11px] sm:text-xs text-blue-800">Actual \ Predicted</span></th>
                          {classLabels.map((label) => (<th key={label} className="p-2 border border-blue-200 bg-blue-100 font-semibold text-blue-900 text-xs sm:text-sm">{label}</th>))}
                        </tr>
                      </thead>
                      <tbody>
                        {confusionMatrixData.map((row, rowIndex) => (
                          <tr key={row.name}>
                            <th className="p-2 border border-blue-200 bg-blue-100 font-semibold text-blue-900 text-xs sm:text-sm">{row.name}</th>
                            {row.values.map((value, colIndex) => (
                              <td key={`${rowIndex}-${colIndex}`} className={`p-2 border border-blue-200 font-mono text-sm ${rowIndex === colIndex ? "bg-green-100 text-green-800 font-bold" : "bg-red-50 text-red-700"}`}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Trusted by Institutions Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by Leading Institutions</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">AnYa-Med is recognized and validated by top medical institutions worldwide</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              <div className="w-28 h-14 sm:w-32 sm:h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"><span className="text-blue-800 font-semibold">WHO</span></div>
              <div className="w-28 h-14 sm:w-32 sm:h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"><span className="text-blue-800 font-semibold">AIIMS</span></div>
              <div className="w-28 h-14 sm:w-32 sm:h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"><span className="text-blue-800 font-semibold">Stanford</span></div>
              <div className="w-28 h-14 sm:w-32 sm:h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"><span className="text-blue-800 font-semibold">Mayo Clinic</span></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center"><Stethoscope className="w-5 h-5 text-white" /></div>
                <span className="text-xl font-bold">AnYa-Med</span>
              </div>
              <p className="text-gray-400">Revolutionizing medical diagnostics with AI. Created by Yash and Anam.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#research" className="hover:text-white transition-colors">Research</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
             <div className="md:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
                 <p className="text-gray-400 text-sm">AnYa-Med is a proof-of-concept project and is not intended for real-world medical diagnosis. Always consult a qualified healthcare professional.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AnYa-Med. All rights reserved. Created by Yash and Anam.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;