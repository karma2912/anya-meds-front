"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Stethoscope,
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
  Calendar,
  BriefcaseMedical,
  Loader2,
  AlertCircle,
  Building, // New icon for Practice Name
  FileBadge, // New icon for NPI/License
} from "lucide-react";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();
  // --- REFACTORED: Removed location state, added professional fields ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added for validation
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [practiceName, setPracticeName] = useState(""); // Added Practice/Hospital Name
  const [npiNumber, setNpiNumber] = useState(""); // Added NPI Number
  const [medicalLicense, setMedicalLicense] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI State for feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // --- REFACTORED: Added password confirmation check ---
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    // --- REFACTORED: Updated formData with new professional fields ---
    const formData = {
      role: "provider",
      fullName,
      email,
      password,
      dateOfBirth,
      phone,
      practiceName,
      npiNumber,
      medicalLicense,
      specialization,
    };

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log("Signup successful:", data);
      router.push('/login?signup=success');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-900">AnYa-Meds</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Provider Account Registration
          </h1>
          <p className="text-gray-600 mt-2">
            Create your secure healthcare provider account.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            {/* --- REFACTORED: Reorganized form fields for better flow --- */}
            <fieldset className="border rounded-lg p-4 grid md:grid-cols-2 gap-4">
              <legend className="text-sm font-medium px-1">Personal Information</legend>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type="text" id="fullName" placeholder="Dr. John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="pl-10"/>
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required className="pl-10"/>
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type="email" id="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10"/>
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input type="tel" id="phone" placeholder="(123) 456-7890" value={phone} onChange={(e) => setPhone(e.target.value)} required className="pl-10"/>
                </div>
              </div>
            </fieldset>

            {/* --- REFACTORED: New "Professional Details" section --- */}
            <fieldset className="border rounded-lg p-4 grid md:grid-cols-2 gap-4">
              <legend className="text-sm font-medium px-1">Professional Details</legend>
              <div className="md:col-span-2 grid w-full items-center gap-1.5">
                <Label htmlFor="practiceName">Practice / Hospital Name</Label>
                <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="text" id="practiceName" placeholder="General Hospital" value={practiceName} onChange={(e) => setPracticeName(e.target.value)} required className="pl-10"/>
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="medicalLicense">Medical License #</Label>
                <div className="relative">
                    <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="text" id="medicalLicense" placeholder="GMC7891234" value={medicalLicense} onChange={(e) => setMedicalLicense(e.target.value)} required className="pl-10"/>
                </div>
              </div>
               <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="npiNumber">NPI Number (Optional)</Label>
                <div className="relative">
                    <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="text" id="npiNumber" placeholder="1234567890" value={npiNumber} onChange={(e) => setNpiNumber(e.target.value)} className="pl-10"/>
                </div>
              </div>
              <div className="md:col-span-2 grid w-full items-center gap-1.5">
                <Label htmlFor="specialization">Specialization</Label>
                 <div className="relative">
                    <BriefcaseMedical className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="text" id="specialization" placeholder="Cardiology, Radiology, etc." value={specialization} onChange={(e) => setSpecialization(e.target.value)} required className="pl-10"/>
                </div>
              </div>
            </fieldset>

            {/* --- REFACTORED: New "Security" section with password confirmation --- */}
            <fieldset className="border rounded-lg p-4 grid md:grid-cols-2 gap-4">
               <legend className="text-sm font-medium px-1">Security</legend>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="pl-10"/>
                  </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="password" id="confirmPassword" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className="pl-10"/>
                  </div>
                </div>
            </fieldset>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3 pt-2">
                <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"/>
                <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="font-medium text-blue-600 hover:underline">Terms of Service</a> and{" "}
                    <a href="/privacy" target="_blank" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>.
                </Label>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Provider Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/" className="font-medium text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} AnYa-Meds. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
