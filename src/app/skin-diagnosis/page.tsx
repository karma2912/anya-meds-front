'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Thermometer, Download, AlertCircle, CheckCircle, Upload, User, Activity, XCircle,Bandage } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

const SkinDiagnosisPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    photoDate: '',
    symptoms: '',
    skinType: '',
    affectedArea: '',
    duration: '',
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
    if (!patientInfo.photoDate.trim()) newErrors.photoDate = 'Photo date is required';
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
      setApiError("No skin image uploaded.");
      return;
    }

    setCurrentStep(3);
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await fetch('http://localhost:5000/api/skin', {
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
    console.log("Report generation initiated.");
    const reportContent = `
AnYa-Skin AI Diagnostic Report
==============================

Patient Information
-------------------
Name: ${patientInfo.name}
Age: ${patientInfo.age}
Gender: ${patientInfo.gender}
Photo Date: ${patientInfo.photoDate}
Skin Type: ${patientInfo.skinType || 'N/A'}
Affected Area: ${patientInfo.affectedArea || 'N/A'}
Duration: ${patientInfo.duration || 'N/A'}
Allergies: ${patientInfo.allergies || 'N/A'}
Medications: ${patientInfo.medications || 'N/A'}
Medical History: ${patientInfo.medicalHistory || 'N/A'}
Symptoms: ${patientInfo.symptoms || 'N/A'}

AI Analysis Results
-------------------
Diagnosis: ${analysis?.label}
Confidence: ${((analysis?.confidence || 0) * 100).toFixed(2)}%

Probability Distribution:
${analysis?.probabilities.map(p => `- ${p.label}: ${Math.round(p.value * 100)}%`).join('\n')}

Disclaimer: This is an AI-generated report for educational and research purposes and is not a substitute for professional medical advice.
    `;
    const blob = new Blob([reportContent.trim()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AnYaSkin_Report_${patientInfo.name.replace(/\s/g, '_') || 'patient'}.txt`;
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
      photoDate: '',
      symptoms: '',
      skinType: '',
      affectedArea: '',
      duration: '',
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step === currentStep ? 'bg-orange-600 text-white' : step < currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {index < 3 && <div className={`w-12 sm:w-16 h-0.5 transition-all ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card className="bg-gradient-to-r from-orange-50 to-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-orange-600 flex items-center justify-center gap-2">
          <Upload className="w-6 h-6" />
          Upload Skin Image
        </CardTitle>
        <CardDescription>Please upload a clear photo of the affected skin area</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <Bandage className="w-10 h-10 text-orange-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop the image here' : 'Drag & drop a skin image'}
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
          <CardTitle className="text-orange-600 flex items-center gap-2">
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
                  <Label htmlFor="photo-date" className="text-sm font-medium">
                    Photo Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="photo-date"
                    type="date"
                    value={patientInfo.photoDate}
                    onChange={(e) => handlePatientInfoChange('photoDate', e.target.value)}
                    className={errors.photoDate ? 'border-red-500' : ''}
                  />
                  {errors.photoDate && <p className="text-red-500 text-xs mt-1">{errors.photoDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="skin-type" className="text-sm font-medium">
                    Skin Type
                  </Label>
                  <Input
                    id="skin-type"
                    value={patientInfo.skinType}
                    onChange={(e) => handlePatientInfoChange('skinType', e.target.value)}
                    placeholder="e.g., Oily, Dry, Combination"
                  />
                </div>
                <div>
                  <Label htmlFor="affected-area" className="text-sm font-medium">
                    Affected Area
                  </Label>
                  <Input
                    id="affected-area"
                    value={patientInfo.affectedArea}
                    onChange={(e) => handlePatientInfoChange('affectedArea', e.target.value)}
                    placeholder="e.g., Face, Arm, Leg"
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    value={patientInfo.duration}
                    onChange={(e) => handlePatientInfoChange('duration', e.target.value)}
                    placeholder="e.g., 2 weeks, 1 month"
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
                  placeholder="e.g., Itching, redness, pain"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <Label className="text-sm font-medium mb-2">Uploaded Skin Image</Label>
              <div className="border rounded-xl overflow-hidden bg-gray-100 flex-1 flex items-center justify-center p-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Uploaded skin image"
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
            <Button onClick={handleStartAnalysis} className="bg-orange-600 hover:bg-orange-700 cursor-pointer">
              <Activity className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <Card className="bg-gradient-to-r from-orange-50 to-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-orange-600 flex items-center justify-center gap-2">
          <Thermometer className="w-6 h-6" />
          Analyzing Skin Image
        </CardTitle>
        <CardDescription>AI is processing the image, please wait...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
              <Bandage className="w-10 h-10 text-orange-600" />
            </div>
            <div className="absolute -inset-3 border-4 border-orange-200 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-700">Analyzing skin patterns...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
          <div className="w-full max-w-md">
            <Progress value={undefined} className="h-2" />
            <p className="text-xs text-gray-500 text-center mt-2">Examining dermatological features...</p>
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
              <h3 className="text-lg font-semibold mb-2">Skin Image</h3>
              <div className="relative">
                <div className="border rounded-xl overflow-hidden bg-gray-100">
                  {imagePreview && (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Analyzed skin image"
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
                <div className="bg-orange-100 text-orange-800 px-4 py-3 rounded-lg font-bold text-lg text-center">
                  {analysis?.label}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Confidence Level</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-orange-600">
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
                        : "Low confidence - Dermatologist consultation suggested"}
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
            <CardTitle className="text-orange-600">Patient Summary</CardTitle>
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
                  <p className="text-sm font-medium text-gray-500">Photo Date</p>
                  <p className="text-gray-900">{patientInfo.photoDate}</p>
                </div>
                {patientInfo.skinType && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Skin Type</p>
                    <p className="text-gray-900">{patientInfo.skinType}</p>
                  </div>
                )}
                {patientInfo.affectedArea && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Affected Area</p>
                    <p className="text-gray-900">{patientInfo.affectedArea}</p>
                  </div>
                )}
                {patientInfo.duration && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-gray-900">{patientInfo.duration}</p>
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
                  <p className="text-gray-900">DenseNet201 v3.1</p>
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
            <CardTitle className="text-orange-600">Actions</CardTitle>
            <CardDescription>Download the report or start over</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleDownloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Download Text Report
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2 flex items-center justify-center gap-3">
            <Bandage className="w-8 h-8" />
            AnYa Skin System
          </h1>
          <p className="text-gray-600 text-md sm:text-lg">CNN Model Dermatological Analysis Platform</p>
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
            Always consult with qualified dermatologists for proper medical evaluation.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SkinDiagnosisPage;