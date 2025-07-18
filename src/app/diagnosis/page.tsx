'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Stethoscope, Thermometer, Download, AlertCircle, CheckCircle, Upload, User, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const page = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    xrayDate: '',
    symptoms: ''
  });
  const [analysis, setAnalysis] = useState<{
    label: string;
    confidence: number;
    probabilities: { label: string; value: number }[];
    heatmap?: string;
  } | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setCurrentStep(2);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  const handleStartAnalysis = async () => {
    if (!validatePatientInfo()) return;
    if (!image) {
      alert("No image uploaded.");
      return;
    }

    setCurrentStep(3);
    setIsAnalyzing(true);

    try {
      // Convert data URL to blob
      const blob = await fetch(image).then(r => r.blob());
      const formData = new FormData();
      formData.append('image', blob, 'xray.png');

      const res = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setAnalysis(data);
        setCurrentStep(4);
      } else {
        console.error('Backend error:', data);
        alert("Analysis failed: " + (data.error || "Unknown error"));
      }

    } catch (err) {
      console.error("Prediction error:", err);
      alert("Prediction failed. Check console.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    alert("PDF report generation would happen here in a real implementation");
  };

  const handleNewAnalysis = () => {
    setImage(null);
    setAnalysis(null);
    setPatientInfo({
      name: '',
      age: '',
      gender: '',
      xrayDate: '',
      symptoms: ''
    });
    setCurrentStep(1);
    setErrors({});
    setShowHeatmap(false);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === currentStep
                  ? 'bg-blue-600 text-white'
                  : step < currentStep
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 4 && (
              <div
                className={`w-16 h-0.5 ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
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
            <div className="md:col-span-2">
              <Label htmlFor="symptoms" className="text-sm font-medium">
                Symptoms (Optional)
              </Label>
              <Input
                id="symptoms"
                value={patientInfo.symptoms}
                onChange={(e) => handlePatientInfoChange('symptoms', e.target.value)}
                placeholder="e.g., Fever, cough, shortness of breath"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Uploaded X-ray</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="border rounded-xl overflow-hidden bg-gray-100">
              { image && <img
                src={image}
                alt="Uploaded X-ray"
                className="w-80 h-80 object-cover"
              />}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back to Upload
        </Button>
        <Button onClick={handleStartAnalysis} className="bg-blue-600 hover:bg-blue-700">
          <Activity className="w-4 h-4 mr-2" />
          Start Analysis
        </Button>
      </div>
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
            <Progress value={65} className="h-2" />
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
              <h3 className="text-lg font-semibold mb-4">Patient X-ray</h3>
              <div className="relative">
                <div className="border rounded-xl overflow-hidden bg-gray-100">
                  {image && (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Analyzed X-ray"
                        className={`w-full h-80 object-cover ${showHeatmap ? 'opacity-70' : ''}`}
                      />
                      {showHeatmap && analysis?.heatmap && (
                        <img
                          src={analysis.heatmap}
                          alt="Heatmap overlay"
                          className="absolute inset-0 w-full h-80 object-cover mix-blend-multiply"
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
                <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-lg font-medium text-center">
                  {analysis?.label}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Confidence Level</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
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
                        ? "Moderate confidence - Further review recommended"
                        : "Low confidence - Additional tests suggested"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Probability Distribution</h3>
                <div className="space-y-2">
                  {analysis?.probabilities.map((prob) => (
                    <div key={prob.label} className="flex items-center gap-3">
                      <span className="w-28 text-sm text-gray-600">{prob.label}</span>
                      <Progress value={prob.value * 100} className="h-2 flex-1" />
                      <span className="w-10 text-right text-sm font-medium">
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
            <CardTitle className="text-blue-600">Export Report</CardTitle>
            <CardDescription>Generate comprehensive medical report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium">Report Contents</h4>
                </div>
                <div className="text-sm space-y-2">
                  <p>• Patient demographics and history</p>
                  <p>• X-ray image with analysis overlay</p>
                  <p>• AI diagnosis with confidence metrics</p>
                  <p>• Probability distribution chart</p>
                  <p>• Clinical recommendations</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button variant="outline" className="w-full" onClick={handleNewAnalysis}>
                  Analyze New Patient
                </Button>
              </div>
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
          <h1 className="text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-3">
            <Stethoscope className="w-8 h-8" />
            Medical Diagnosis System
          </h1>
          <p className="text-gray-600 text-lg">AI-Powered Chest X-ray Analysis Platform</p>
        </div>
        {renderStepIndicator()}

        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        <Alert className="mt-8 max-w-6xl mx-auto border-yellow-200 bg-yellow-50">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Medical Disclaimer:</strong> This diagnostic tool is for educational and research purposes only. 
            Results should not be used as the sole basis for medical diagnosis or treatment decisions. 
            Always consult with qualified healthcare professionals for proper medical evaluation.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default page;