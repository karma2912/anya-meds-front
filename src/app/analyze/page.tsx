'use client'
import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from '@/components/icons'
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }, [])

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setResults({
            diagnosis: 'Pneumonia detected',
            confidence: 0.92,
            abnormalities: [
              { name: 'Lung opacity', confidence: 0.92 },
              { name: 'Fracture', confidence: 0.15 },
              { name: 'Tumor', confidence: 0.08 }
            ],
            heatmap: '/heatmap.png'
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="w-[100vw] py-4 px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icons.brain className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-900">AIXray</span>
          </div>
          <Button variant="ghost" className="text-blue-600">
            <Icons.user className="mr-2 h-4 w-4" />
            Dr. Yash
          </Button>
        </div>
      </header>

      <main className=" w-[100vw] py-8 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Chest X-Ray</CardTitle>
                <CardDescription>
                  Upload DICOM or JPEG/PNG format. Minimum resolution 1024x1024px.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg p-12 bg-blue-50">
                  {preview ? (
                    <div className="relative w-full h-64 mb-4">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="object-contain w-full h-full rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <Icons.upload className="mx-auto h-12 w-12 text-blue-400" />
                      <p className="text-gray-500">Drag & drop your X-ray here or click to browse</p>
                    </div>
                  )}
                  <Input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".dcm,.jpeg,.jpg,.png"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="border-blue-300 text-blue-600">
                      {preview ? 'Change Image' : 'Select File'}
                    </Button>
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!file || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </Button>
              </CardFooter>
            </Card>

            {isAnalyzing && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis in Progress</CardTitle>
                  <CardDescription>
                    Our AI model is processing your image. This usually takes 15-30 seconds.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2" />
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Model</div>
                      <div className="font-medium">ResNet-152</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Progress</div>
                      <div className="font-medium">{progress}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">ETA</div>
                      <div className="font-medium">{Math.ceil((100 - progress) / 10 * 3)}s</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    AI-detected abnormalities with confidence scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="diagnosis">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                      <TabsTrigger value="abnormalities">Abnormalities</TabsTrigger>
                      <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                    </TabsList>
                    <TabsContent value="diagnosis" className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">Primary Diagnosis</h3>
                          <p className="text-gray-500">Most likely condition detected</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-800">{results.diagnosis}</div>
                          <div className="text-blue-600">
                            Confidence: {(results.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <h3 className="font-medium flex items-center">
                          <Icons.alert className="h-5 w-5 text-yellow-600 mr-2" />
                          Clinical Recommendation
                        </h3>
                        <p className="mt-2 text-gray-700">
                          Based on the detected pneumonia, we recommend further evaluation with CT scan and consideration of antibiotic therapy.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="abnormalities">
                      <div className="space-y-4">
                        {results.abnormalities.map((ab: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="font-medium">{ab.name}</div>
                            <div className="flex items-center">
                              <Progress 
                                value={ab.confidence * 100} 
                                className="h-2 w-32 mr-4" 
                              />
                              <span className="font-mono text-sm">
                                {(ab.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="heatmap">
                      <div className="relative w-full h-64">
                        <img 
                          src={results.heatmap} 
                          alt="Heatmap" 
                          className="object-contain w-full h-full rounded-lg"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Icons.download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Icons.share className="mr-2 h-4 w-4" />
                    Share with Colleague
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Patient ID</Label>
                  <Input value="PT-4892-2023" readOnly />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input value="John Doe" readOnly />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input value="45" readOnly />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Input value="Male" readOnly />
                </div>
                <div>
                  <Label>Referring Physician</Label>
                  <Input value="Dr. Sarah Johnson" readOnly />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Studies</CardTitle>
                <CardDescription>Previous imaging for this patient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="bg-blue-100 p-2 rounded-md mr-4">
                      <Icons.xray className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Chest X-Ray {i === 1 ? '(Current)' : ''}</h3>
                      <p className="text-sm text-gray-500">
                        {i === 1 ? 'Today' : `${3*i} months ago`} • {i === 3 ? 'Normal' : 'Abnormal'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}