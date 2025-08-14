'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link'; // Added for navigation
import { FileText, Brain, Thermometer, Download, AlertCircle, CheckCircle, Upload, User, Activity, XCircle, Scan, BrainCircuit, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileScan } from 'lucide-react';
import Image from 'next/image';

const BrainDiagnosisPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    scanDate: '',
    symptoms: '',
    weight: '',
    height: '',
    bloodPressure: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
    scanType: '',
    contrastUsed: '',
    referringPhysician: ''
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
    if (!patientInfo.scanDate.trim()) newErrors.scanDate = 'Scan date is required';
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
      if (file.size > 20 * 1024 * 1024) {
        setApiError('File size exceeds 20MB limit.');
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
      'application/dicom': ['.dcm'],
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
      setApiError("No MRI scan uploaded.");
      return;
    }

    setCurrentStep(3);
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('patientInfo', JSON.stringify(patientInfo));

      const res = await fetch('http://localhost:5000/api/brain', {
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
        setApiError("Connection failed. Please ensure the analysis server is running.");
      } else {
        setApiError("A client-side error occurred. Please try again.");
      }
      setCurrentStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    const reportContent = `
AnYa-Med Brain MRI Diagnostic Report
===================================

Patient Information
-------------------
Name: ${patientInfo.name}
Age: ${patientInfo.age}
Gender: ${patientInfo.gender}
Scan Date: ${patientInfo.scanDate}
Weight: ${patientInfo.weight || 'N/A'}
Height: ${patientInfo.height || 'N/A'}
Blood Pressure: ${patientInfo.bloodPressure || 'N/A'}
Allergies: ${patientInfo.allergies || 'N/A'}
Medications: ${patientInfo.medications || 'N/A'}
Scan Type: ${patientInfo.scanType || 'N/A'}
Contrast Used: ${patientInfo.contrastUsed || 'N/A'}
Referring Physician: ${patientInfo.referringPhysician || 'N/A'}

Symptoms: ${patientInfo.symptoms || 'N/A'}
Medical History: ${patientInfo.medicalHistory || 'N/A'}

AI Analysis Results
-------------------
Diagnosis: ${analysis?.label}
Confidence: ${((analysis?.confidence || 0) * 100).toFixed(2)}%

Probability Distribution:
${analysis?.probabilities.map(p => `- ${p.label}: ${Math.round(p.value * 100)}%`).join('\n')}

Clinical Notes:
${analysis?.label.includes('Tumor') ?
  'Consider neurosurgical consultation and contrast-enhanced MRI for further evaluation.' :
  'No significant structural abnormalities found. Routine follow-up recommended.'}

Disclaimer: This is an AI-generated report for educational and research purposes and is not a substitute for professional medical advice.
    `;
    const blob = new Blob([reportContent.trim()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AnYaMed_Brain_Report_${patientInfo.name.replace(/\s/g, '_') || 'patient'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewAnalysis = () => {
    setImagePreview(null);
    setImageFile(null);
    setAnalysis(null);
    setPatientInfo({ 
      name: '', 
      age: '', 
      gender: '', 
      scanDate: '', 
      symptoms: '',
      weight: '',
      height: '',
      bloodPressure: '',
      allergies: '',
      medications: '',
      medicalHistory: '',
      scanType: '',
      contrastUsed: '',
      referringPhysician: ''
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step === currentStep ? 'bg-purple-600 text-white' : step < currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {index < 3 && <div className={`w-12 sm:w-16 h-0.5 transition-all ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card className="bg-gradient-to-r from-purple-50 to-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-purple-600 flex items-center justify-center gap-2">
          <Scan className="w-6 h-6" />
          Upload Brain MRI
        </CardTitle>
        <CardDescription>Upload axial, sagittal, or coronal MRI slices for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <BrainCircuit className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop the MRI scan here' : 'Drag & drop a brain MRI image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to select from your device</p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <p className="text-xs text-gray-600">Supported formats: JPG, PNG, DICOM • Max size: 20MB</p>
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-purple-600 flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Information
          </CardTitle>
          <CardDescription>Complete all required fields before analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="patient-name" className="text-sm font-medium">
                Patient Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="patient-name"
                value={patientInfo.name}
                onChange={(e) => handlePatientInfoChange('name', e.target.value)}
                placeholder="Full name"
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
                placeholder="Years"
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
              <Label htmlFor="scan-date" className="text-sm font-medium">
                Scan Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scan-date"
                type="date"
                value={patientInfo.scanDate}
                onChange={(e) => handlePatientInfoChange('scanDate', e.target.value)}
                className={errors.scanDate ? 'border-red-500' : ''}
              />
              {errors.scanDate && <p className="text-red-500 text-xs mt-1">{errors.scanDate}</p>}
            </div>
            <div>
              <Label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={patientInfo.weight}
                onChange={(e) => handlePatientInfoChange('weight', e.target.value)}
                placeholder="Weight in kg"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-sm font-medium">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={patientInfo.height}
                onChange={(e) => handlePatientInfoChange('height', e.target.value)}
                placeholder="Height in cm"
              />
            </div>
            <div>
              <Label htmlFor="bloodPressure" className="text-sm font-medium">
                Blood Pressure
              </Label>
              <Input
                id="bloodPressure"
                value={patientInfo.bloodPressure}
                onChange={(e) => handlePatientInfoChange('bloodPressure', e.target.value)}
                placeholder="e.g., 120/80"
              />
            </div>
            <div>
              <Label htmlFor="scanType" className="text-sm font-medium">
                MRI Scan Type
              </Label>
              <Input
                id="scanType"
                value={patientInfo.scanType}
                onChange={(e) => handlePatientInfoChange('scanType', e.target.value)}
                placeholder="e.g., T1, T2, FLAIR"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="symptoms" className="text-sm font-medium">
                Neurological Symptoms
              </Label>
              <Textarea
                id="symptoms"
                value={patientInfo.symptoms}
                onChange={(e) => handlePatientInfoChange('symptoms', e.target.value)}
                placeholder="e.g., Headaches, seizures, vision changes"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="medicalHistory" className="text-sm font-medium">
                Relevant Medical History
              </Label>
              <Textarea
                id="medicalHistory"
                value={patientInfo.medicalHistory}
                onChange={(e) => handlePatientInfoChange('medicalHistory', e.target.value)}
                placeholder="Previous neurological conditions, surgeries, etc."
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-purple-600 flex items-center gap-2">
            <FileScan className="w-5 h-5" />
            MRI Scan Preview
          </CardTitle>
          <CardDescription>Uploaded brain MRI for analysis</CardDescription>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Uploaded MRI"
                width={400}
                height={400}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="text-gray-400 text-center p-4">
                <FileScan className="mx-auto w-8 h-8 mb-2" />
                <p>No MRI scan uploaded</p>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={handleNewAnalysis}
              className="w-full"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartAnalysis} 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!imagePreview}
            >
              <Activity className="w-4 h-4 mr-2" />
              Analyze MRI
            </Button>
          </div>
        </CardContent>
      </Card>

      {apiError && (
        <Alert variant="destructive" className="lg:col-span-3 mt-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep3 = () => (
    <Card className="bg-gradient-to-r from-purple-50 to-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-purple-600 flex items-center justify-center gap-2">
          <Brain className="w-6 h-6" />
          Analyzing Brain MRI
        </CardTitle>
        <CardDescription>Deep learning model processing neurological patterns...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center animate-pulse">
              <Brain className="w-10 h-10 text-purple-600" />
            </div>
            <div className="absolute -inset-3 border-4 border-purple-200 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-700">Detecting neurological patterns...</p>
            <p className="text-sm text-gray-500">3D convolutional neural network processing</p>
          </div>
          <div className="w-full max-w-md">
            <Progress value={undefined} className="h-2 bg-purple-100" />
            <p className="text-xs text-gray-500 text-center mt-2">Analyzing brain structures and potential abnormalities...</p>
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
            Neurological Analysis Complete
          </CardTitle>
          <CardDescription>Modal has completed evaluation of brain structures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">MRI Scan with GradCam Markers</h3>
              <div className="relative">
                <div className="border rounded-xl overflow-hidden bg-gray-100">
                  {imagePreview && (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Analyzed MRI"
                        width={400}
                        height={400}
                        className={`w-full h-auto object-contain transition-opacity duration-300 ${showHeatmap ? 'opacity-70' : ''}`}
                      />
                      {showHeatmap && analysis?.heatmap && (
                        <Image
                          src={`data:image/png;base64,${analysis.heatmap}`}
                          alt="Neurological heatmap overlay"
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
                      Activation Map
                    </Toggle>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Neurological Findings</h3>
                <div className={`px-4 py-3 rounded-lg font-bold text-lg text-center ${
                  analysis?.label.includes('Normal') ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {analysis?.label}
                </div>
                <p className="text-sm text-gray-600 mt-1 text-center">
                  {analysis?.label.includes('Tumor') ?
                    'Structural abnormality detected' :
                    'No significant structural abnormalities found'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Model Confidence</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-purple-600">
                      {analysis ? Math.round(analysis.confidence * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <Progress value={analysis ? analysis.confidence * 100 : 0} className="h-3 bg-purple-100" />
                    <p className="text-sm text-gray-600 mt-1">
                      {analysis && analysis.confidence >= 0.9
                        ? "High confidence - Clear neurological indicators"
                        : analysis && analysis.confidence >= 0.7
                        ? "Moderate confidence - Clinical correlation recommended"
                        : "Low confidence - Additional imaging suggested"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Differential Probabilities</h3>
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
            <CardTitle className="text-purple-600">Patient Neurological Profile</CardTitle>
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
                  <p className="text-sm font-medium text-gray-500">Scan Date</p>
                  <p className="text-gray-900">{patientInfo.scanDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Weight</p>
                  <p className="text-gray-900">{patientInfo.weight || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Height</p>
                  <p className="text-gray-900">{patientInfo.height || 'N/A'}</p>
                </div>
                {patientInfo.symptoms && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Symptoms</p>
                    <p className="text-gray-900">{patientInfo.symptoms}</p>
                  </div>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">AI Model</p>
                  <p className="text-gray-900">3D ResNet50 v1.2</p>
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
            <CardTitle className="text-purple-600">Next Steps</CardTitle>
            <CardDescription>Download full report or start new analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleDownloadReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Neurological Report
              </Button>
              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                onClick={handleNewAnalysis}
              >
                Analyze New MRI Scan
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
        {currentStep === 1 && (
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
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-3">
            <BrainCircuit className="w-8 h-8" />
            AnYa Brain System
          </h1>
          <p className="text-gray-600 text-md sm:text-lg">Deep Learning Brain MRI Analysis Platform</p>
        </div>
        {renderStepIndicator()}

        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        <Alert className="mt-8 max-w-6xl mx-auto border-blue-300 bg-blue-50">
          <AlertCircle className="w-5 h-5 text-blue-700" />
          <AlertDescription className="text-blue-800 text-sm">
            <strong>Clinical Note:</strong> This AI tool detects common neurological abnormalities but cannot
            identify all possible conditions. False negatives may occur. Always correlate with clinical
            findings and consider follow-up imaging when indicated.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default BrainDiagnosisPage;