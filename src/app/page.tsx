'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { 
  Upload, 
  Brain, 
  FileText, 
  Stethoscope, 
  Shield, 
  Award,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

const AnYaMedLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-14">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-900">AnYa-Med</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#research" className="text-gray-700 hover:text-blue-600 transition-colors">Research</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-100">
              <div className="flex flex-col space-y-3">
                <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                <a href="#research" className="text-gray-700 hover:text-blue-600 transition-colors">Research</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-fit">
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="h-[calc(100vh-10rem)] py-20 px-4 sm:px-6 lg:px-14">

        <div className="max-w-7xl mx-auto h-full flex justify-center items-start">
          <div className="grid lg:grid-cols-2 gap-48 items-center lg:pt-14">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="block text-blue-600">Chest X-Ray</span>
                  <span className="block">Diagnosis</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Revolutionary medical diagnostic system that analyzes chest X-rays with 98%+ accuracy, 
                  detecting COVID-19, Pneumonia, Lung Opacity, and other critical conditions instantly.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Try Demo
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                  Learn More
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">98%+ Accuracy</span>
                </div>
              </div>
            </div>

            {/* Right Column - Medical Image */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
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
              <CardTitle className="text-2xl text-blue-900 text-center">AnYa-Med Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Name</h3>
                    <p className="text-gray-600">AnYa-Med (by Yash and Anam)</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Purpose</h3>
                    <p className="text-gray-600">AI-powered chest X-ray diagnosis system designed to assist healthcare professionals in rapid and accurate medical imaging analysis.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        COVID-19 Detection
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Pneumonia Identification
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Lung Opacity Analysis
                      </li>
                      <li className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        NIH Disease Detection
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy</h3>
                    <p className="text-gray-600">
                      <span className="text-2xl font-bold text-blue-600">98%+</span> accuracy on validation set
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How AnYa-Med Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered diagnostic system provides accurate results in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-900">Upload Image</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Securely upload chest X-ray images through our HIPAA-compliant platform. 
                  Supports multiple image formats with instant processing.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-900">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Our advanced neural network analyzes the X-ray using state-of-the-art deep learning 
                  algorithms trained on thousands of medical images.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-900">Get Report</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Receive a comprehensive diagnostic report with confidence scores, 
                  findings, and recommendations for healthcare professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials/Institution Logos Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by Leading Institutions</h2>
            <p className="text-xl text-gray-600">
              AnYa-Med is recognized and validated by top medical institutions worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {/* Institution placeholders */}
            <div className="w-32 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-blue-800 font-semibold">WHO</span>
            </div>
            <div className="w-32 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-blue-800 font-semibold">AIIMS</span>
            </div>
            <div className="w-32 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-blue-800 font-semibold">Stanford</span>
            </div>
            <div className="w-32 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <span className="text-blue-800 font-semibold">Mayo Clinic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AnYa-Med</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Revolutionizing medical diagnostics with AI-powered chest X-ray analysis. 
                Created by Yash and Anam for better healthcare outcomes.
              </p>
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
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AnYa-Med. All rights reserved. Created by Yash and Anam.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AnYaMedLanding;