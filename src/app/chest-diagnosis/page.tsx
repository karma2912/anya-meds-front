'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link'; // Added for navigation
import { FileText, Stethoscope, Thermometer, Download, AlertCircle, CheckCircle, Upload, User, Activity, XCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const DiagnosisPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    xrayDate: '',
    symptoms: '',
    bloodPressure: '',
    weight: '',
    height: '',
    allergies: '',
    medications: '',
    medicalHistory: ''
  });
  const [analysis, setAnalysis] = useState<{
    label: string;
    confidence: number;
    probabilities: { label: string; value: number }[];
    heatmap?: string;
  } | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const validatePatientInfo = () => {
    const newErrors: {[key: string]: string} = {};
    if (!patientInfo.name.trim()) newErrors.name = 'Patient name is required';
    if (!patientInfo.age.trim()) newErrors.age = 'Age is required';
    if (!patientInfo.gender.trim()) newErrors.gender = 'Gender is required';
    if (!patientInfo.xrayDate.trim()) newErrors.xrayDate = 'X-ray date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePatientInfoChange = (field: string, value: string) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setApiError('File size exceeds 10MB limit.');
        return;
      }
      setApiError(null);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCurrentStep(2);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    onDropRejected: (fileRejections) => {
      setApiError(fileRejections.map(fr => fr.errors.map(e => e.message).join(', ')).join('; '));
    }
  });

  const handleStartAnalysis = async () => {
    if (!validatePatientInfo()) {
      setApiError('Please fill in all required patient information.');
      return;
    }
    if (!imageFile) { 
      setApiError("No X-ray image uploaded.");
      return;
    }

    setCurrentStep(3);
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile); 

      const res = await fetch('http://localhost:5000/api/chest', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setAnalysis(data);
        setCurrentStep(4);
      } else {
        console.error('Backend error response:', data);
        setApiError(data.error || "An unknown error occurred during analysis.");
        setCurrentStep(2);
      }

    } catch (err: any) {
      console.error("Prediction fetch error:", err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setApiError("Connection failed. Please ensure the Python analysis server is running.");
      } else {
        setApiError("A client-side error occurred. Please try again.");
      }
      setCurrentStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleDownloadReport = () => {
  console.log("PDF Report generation initiated.");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const primaryColor: [number, number, number] = [40, 116, 252]; // AnYa blue
  const secondaryColor: [number, number, number] = [100, 100, 100]; // Gray
  const accentColor: [number, number, number] = [241, 90, 34]; // Orange for highlights

  // ===== 1. COVER PAGE (Simplified Text Version) =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(...primaryColor);
  doc.text("AnYa Meds", pageWidth / 2, 80, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(...secondaryColor);
  doc.text("Chest X-Ray Analysis Report", pageWidth / 2, 100, { align: 'center' });

  // Patient info box
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 140, pageWidth - margin*2, 40, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.rect(margin, 140, pageWidth - margin*2, 40);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Patient: ${patientInfo.name}`, margin + 10, 150);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin + 10, 160);
 doc.text(`Report ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`, pageWidth - margin - 10, 150, { align: 'right' });

  // ===== 2. PATIENT DETAILS PAGE =====
  doc.addPage();
  
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text("Patient Information", margin, 30);

  // Note: Ensure your patientInfo state for the chest page includes these fields
  autoTable(doc, {
    startY: 40,
    head: [['Detail', 'Value']],
    body: [
      ['Full Name', patientInfo.name],
      ['Age', patientInfo.age],
      ['Gender', patientInfo.gender],
      ['X-Ray Date', patientInfo.xrayDate] // Changed from photoDate
    ],
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      halign: 'left',
      cellPadding: 5
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 }
    }
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [['Medical Information', '']],
    body: [
      ['Blood Pressure', patientInfo.bloodPressure || 'Not specified'],
      ['Weight', patientInfo.weight || 'Not specified'],
      ['Height', patientInfo.height || 'Not specified'],
      ['Symptoms', patientInfo.symptoms || 'None reported'],
      ['Allergies', patientInfo.allergies || 'None reported'],
      ['Medications', patientInfo.medications || 'None reported'],
      ['Medical History', patientInfo.medicalHistory || 'None reported']
    ],
    theme: 'plain',
    styles: {
      halign: 'left',
      cellPadding: 5
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 }
    }
  });

  // ===== 3. ANALYSIS RESULTS PAGE =====
  doc.addPage();

  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text("Radiological Findings Summary", margin, 30);

  doc.setFillColor(240, 248, 255); 
  doc.rect(margin, 40, pageWidth - margin*2, 30, 'F');
  doc.setDrawColor(200, 230, 255);
  doc.rect(margin, 40, pageWidth - margin*2, 30);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Primary Finding:", margin + 10, 50);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text(analysis?.label || "No finding available", margin + 50, 50);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("Confidence Level:", margin + 10, 60);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text(`${((analysis?.confidence || 0) * 100).toFixed(2)}%`, margin + 50, 60);

  const confidence = analysis?.confidence || 0;
  const meterWidth = pageWidth - margin*2 - 20;
  doc.setFillColor(230, 230, 230);
  doc.rect(margin + 10, 70, meterWidth, 8, 'F');
  doc.setFillColor(...(confidence > 0.7 ? primaryColor : accentColor));
  doc.rect(margin + 10, 70, meterWidth * confidence, 8, 'F');

  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text("Finding Probabilities", margin, 100);

  const tableData = analysis?.probabilities
    .sort((a, b) => b.value - a.value)
    .map(p => [ p.label, `${(p.value * 100).toFixed(2)}%` ]) || [];

  autoTable(doc, {
    startY: 110,
    head: [['Finding', 'Probability']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 40, halign: 'right' },
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
  });

  // ===== 4. VISUALIZATION PAGE =====
  if (imagePreview) {
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.text("Radiological Images", margin, 30);

    doc.setFontSize(12);
    doc.setTextColor(...secondaryColor);
    doc.text("Uploaded X-Ray:", margin, 40);

    const imgData = imagePreview;
    const imgWidth = pageWidth - margin*2;
    const imgHeight = (imgWidth * 3) / 4;
    doc.addImage(imgData, 'JPEG', margin, 45, imgWidth, imgHeight);

    if (analysis?.heatmap) {
      doc.setFontSize(12);
      doc.setTextColor(...secondaryColor);
      doc.text("AI Heatmap Analysis:", margin, imgHeight + 55);

      const heatmapData = `data:image/png;base64,${analysis.heatmap}`;
      doc.addImage(heatmapData, 'PNG', margin, imgHeight + 60, imgWidth, imgHeight);
    }
  }

  // ===== 5. DISCLAIMER PAGE =====
  doc.addPage();
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text("Report Disclaimer", margin, 30);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const disclaimerText = [
    "This report was generated by AnYa Med's AI diagnostic system and is intended for use by qualified healthcare professionals only.",
    "",
    "The information contained in this report:",
    "- Is not a substitute for professional medical advice, diagnosis, or treatment",
    "- Should be interpreted in conjunction with other clinical findings from a qualified radiologist",
    "- May contain inaccuracies or errors inherent to AI systems",
    "",
    "The probability scores represent the AI model's confidence in its predictions and do not constitute definitive diagnoses.",
    "",
    "AnYa Med disclaims all liability for any decisions made based on this report. Healthcare providers must exercise their own professional judgment when interpreting these results."
  ];

  let currentY = 50;
  disclaimerText.forEach(line => {
    doc.text(line, margin, currentY, { maxWidth: pageWidth - margin * 2 });
    currentY += (line === "") ? 3 : 6;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text(`Report generated on ${new Date().toLocaleString()}`, margin, 280);
  doc.text("AnYa Med - AI Diagnostic Systems", pageWidth - margin, 280, { align: 'right' });

  // ===== SAVE THE PDF =====
  doc.save(`AnYaChest_Report_${patientInfo.name.replace(/\s/g, '_') || 'patient'}.pdf`);
};

  const handleNewAnalysis = () => {
    setImagePreview(null);
    setImageFile(null);
    setAnalysis(null);
    setPatientInfo({ 
      name: '', 
      age: '', 
      gender: '', 
      xrayDate: '', 
      symptoms: '',
      bloodPressure: '',
      weight: '',
      height: '',
      allergies: '',
      medications: '',
      medicalHistory: ''
    });
    setCurrentStep(1);
    setErrors({});
    setApiError(null);
    setShowHeatmap(false);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-2 sm:space-x-4">
        {[1, 2, 3, 4].map((step, index) => (
          <React.Fragment key={step}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step === currentStep ? 'bg-blue-600 text-white' : step < currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {index < 3 && <div className={`w-12 sm:w-16 h-0.5 transition-all ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card className="bg-gradient-to-r from-blue-50 to-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-blue-600 flex items-center justify-center gap-2">
          <Upload className="w-6 h-6" />
          Upload Patient X-ray
        </CardTitle>
        <CardDescription>Please upload a chest X-ray image to begin the analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an X-ray image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to select from your device</p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <p className="text-xs text-gray-600">Supported formats: JPG, PNG • Max size: 10MB</p>
            </div>
          </div>
        </div>
        {apiError && (
          <Alert variant="destructive" className="mt-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600 flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Information
          </CardTitle>
          <CardDescription>Please fill in the patient details before analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="patient-name" className="text-sm font-medium">
                    Patient Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patient-name"
                    value={patientInfo.name}
                    onChange={(e) => handlePatientInfoChange('name', e.target.value)}
                    placeholder="Enter patient's full name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="patient-age" className="text-sm font-medium">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patient-age"
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) => handlePatientInfoChange('age', e.target.value)}
                    placeholder="Enter age"
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>
                <div>
                  <Label htmlFor="patient-gender" className="text-sm font-medium">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patient-gender"
                    value={patientInfo.gender}
                    onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
                    placeholder="Male/Female/Other"
                    className={errors.gender ? 'border-red-500' : ''}
                  />
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
                <div>
                  <Label htmlFor="xray-date" className="text-sm font-medium">
                    X-ray Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="xray-date"
                    type="date"
                    value={patientInfo.xrayDate}
                    onChange={(e) => handlePatientInfoChange('xrayDate', e.target.value)}
                    className={errors.xrayDate ? 'border-red-500' : ''}
                  />
                  {errors.xrayDate && <p className="text-red-500 text-xs mt-1">{errors.xrayDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="blood-pressure" className="text-sm font-medium">
                    Blood Pressure
                  </Label>
                  <Input
                    id="blood-pressure"
                    value={patientInfo.bloodPressure}
                    onChange={(e) => handlePatientInfoChange('bloodPressure', e.target.value)}
                    placeholder="e.g., 120/80 mmHg"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-sm font-medium">
                    Weight
                  </Label>
                  <Input
                    id="weight"
                    value={patientInfo.weight}
                    onChange={(e) => handlePatientInfoChange('weight', e.target.value)}
                    placeholder="e.g., 70 kg"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-sm font-medium">
                    Height
                  </Label>
                  <Input
                    id="height"
                    value={patientInfo.height}
                    onChange={(e) => handlePatientInfoChange('height', e.target.value)}
                    placeholder="e.g., 175 cm"
                  />
                </div>
                <div>
                  <Label htmlFor="allergies" className="text-sm font-medium">
                    Allergies
                  </Label>
                  <Input
                    id="allergies"
                    value={patientInfo.allergies}
                    onChange={(e) => handlePatientInfoChange('allergies', e.target.value)}
                    placeholder="List any known allergies"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="medications" className="text-sm font-medium">
                  Current Medications
                </Label>
                <Input
                  id="medications"
                  value={patientInfo.medications}
                  onChange={(e) => handlePatientInfoChange('medications', e.target.value)}
                  placeholder="List current medications"
                />
              </div>

              <div>
                <Label htmlFor="medical-history" className="text-sm font-medium">
                  Medical History
                </Label>
                <Input
                  id="medical-history"
                  value={patientInfo.medicalHistory}
                  onChange={(e) => handlePatientInfoChange('medicalHistory', e.target.value)}
                  placeholder="Relevant medical history"
                />
              </div>

              <div>
                <Label htmlFor="symptoms" className="text-sm font-medium">
                  Symptoms
                </Label>
                <Input
                  id="symptoms"
                  value={patientInfo.symptoms}
                  onChange={(e) => handlePatientInfoChange('symptoms', e.target.value)}
                  placeholder="e.g., Fever, cough, shortness of breath"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <Label className="text-sm font-medium mb-2">Uploaded X-ray</Label>
              <div className="border rounded-xl overflow-hidden bg-gray-100 flex-1 flex items-center justify-center p-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Uploaded X-ray"
                    width={400}
                    height={400}
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-8">
                    No image uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          {apiError && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center space-x-4 mt-6">
            <Button variant="outline" onClick={handleNewAnalysis}>
              Start Over
            </Button>
            <Button onClick={handleStartAnalysis} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Activity className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <Card className="bg-gradient-to-r from-blue-50 to-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-blue-600 flex items-center justify-center gap-2">
          <Thermometer className="w-6 h-6" />
          Analyzing X-ray
        </CardTitle>
        <CardDescription>AI is processing the image, please wait...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
              <Thermometer className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute -inset-3 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-700">Processing medical image...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
          <div className="w-full max-w-md">
            <Progress value={undefined} className="h-2" /> 
            <p className="text-xs text-gray-500 text-center mt-2">Analyzing patterns...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Patient X-ray</h3>
              <div className="relative">
                <div className="border rounded-xl overflow-hidden bg-gray-100">
                  {imagePreview && (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Analyzed X-ray"
                        width={400}
                        height={400}
                        className={`w-full h-auto object-contain transition-opacity duration-300 ${showHeatmap ? 'opacity-70' : ''}`}
                      />
                      {showHeatmap && analysis?.heatmap && (
                        <Image
                          src={`data:image/png;base64,${analysis.heatmap}`}
                          alt="Heatmap overlay"
                          width={400}
                          height={400}
                          className="absolute inset-0 w-full h-full object-contain mix-blend-multiply"
                        />
                      )}
                    </div>
                  )}
                </div>
                {analysis?.heatmap && (
                  <div className="absolute top-2 right-2">
                    <Toggle
                      pressed={showHeatmap}
                      onPressedChange={setShowHeatmap}
                      className="bg-white/90 backdrop-blur-sm"
                    >
                      <Activity className="w-4 h-4 mr-1" />
                      Heatmap
                    </Toggle>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Diagnosis Result</h3>
                <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-lg font-bold text-lg text-center">
                  {analysis?.label}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Confidence Level</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-blue-600">
                      {analysis ? Math.round(analysis.confidence * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <Progress value={analysis ? analysis.confidence * 100 : 0} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      {analysis && analysis.confidence >= 0.9
                        ? "High confidence - Strong indication"
                        : analysis && analysis.confidence >= 0.7
                        ? "Moderate confidence - Review recommended"
                        : "Low confidence - Additional tests suggested"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Probability Distribution</h3>
                <div className="space-y-2">
                  {analysis?.probabilities.sort((a,b) => b.value - a.value).map((prob) => (
                    <div key={prob.label} className="flex items-center gap-3">
                      <span className="w-32 text-sm text-gray-600 truncate" title={prob.label}>{prob.label}</span>
                      <Progress value={prob.value * 100} className="h-2 flex-1" />
                      <span className="w-12 text-right text-sm font-medium">
                        {Math.round(prob.value * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Patient Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{patientInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-gray-900">{patientInfo.age} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900">{patientInfo.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">X-ray Date</p>
                  <p className="text-gray-900">{patientInfo.xrayDate}</p>
                </div>
                {patientInfo.bloodPressure && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Blood Pressure</p>
                    <p className="text-gray-900">{patientInfo.bloodPressure}</p>
                  </div>
                )}
                {patientInfo.weight && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Weight</p>
                    <p className="text-gray-900">{patientInfo.weight}</p>
                  </div>
                )}
                {patientInfo.height && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Height</p>
                    <p className="text-gray-900">{patientInfo.height}</p>
                  </div>
                )}
                {patientInfo.allergies && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Allergies</p>
                    <p className="text-gray-900">{patientInfo.allergies}</p>
                  </div>
                )}
                {patientInfo.medications && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Medications</p>
                    <p className="text-gray-900">{patientInfo.medications}</p>
                  </div>
                )}
                {patientInfo.medicalHistory && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Medical History</p>
                    <p className="text-gray-900">{patientInfo.medicalHistory}</p>
                  </div>
                )}
              </div>
              {patientInfo.symptoms && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Symptoms</p>
                  <p className="text-gray-900">{patientInfo.symptoms}</p>
                </div>
              )}
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">AI Model</p>
                  <p className="text-gray-900">DenseNet121 v2.3</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Analysis Date</p>
                  <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Actions</CardTitle>
            <CardDescription>Download the report or start over</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleDownloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" className="w-full" onClick={handleNewAnalysis}>
                Analyze New Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="container mx-auto px-4 py-8 relative">
        {/* Back Button - Renders only on Step 1 */}
        {currentStep === 1  && (
          <div className="absolute top-8 left-4">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        )}
        {currentStep === 4  && (
          <div className="absolute top-8 left-4">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-3">
            <Stethoscope className="w-8 h-8" />
            AnYa Chest System
          </h1>
          <p className="text-gray-600 text-md sm:text-lg">CNN Model Chest X-ray Analysis Platform</p>
        </div>
        {renderStepIndicator()}

        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        <Alert className="mt-8 max-w-6xl mx-auto border-yellow-300 bg-yellow-50">
          <AlertCircle className="w-5 h-5 text-yellow-700" />
          <AlertDescription className="text-yellow-800 text-sm">
            <strong>Medical Disclaimer:</strong> This diagnostic tool is for educational and research purposes only. 
            Results should not be used as the sole basis for medical diagnosis or treatment decisions. 
            Always consult with qualified healthcare professionals for proper medical evaluation.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default DiagnosisPage;