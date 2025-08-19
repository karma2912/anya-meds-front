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
  MapPin,
  Phone,
  Calendar,
  BriefcaseMedical,
} from "lucide-react";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState("patient"); // 'patient' or 'provider'

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [medicalLicense, setMedicalLicense] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    // TODO: Add your signup logic here
    const formData = {
      role: userRole,
      fullName,
      email,
      password,
      dateOfBirth,
      phone,
      location: { address, city, state, zipCode },
      ...(userRole === "provider" && { medicalLicense, specialization }),
    };
    console.log("Signing up with:", formData);
    // router.push('/dashboard');
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
            Create a Secure Account
          </h1>
          <p className="text-gray-600 mt-2">
            Get started by providing the details below.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant={userRole === "patient" ? "default" : "outline"}
              onClick={() => setUserRole("patient")}
              className={`w-full ${
                userRole === "patient" ? "bg-blue-600 text-white" : ""
              }`}
            >
              I am a Patient
            </Button>
            <Button
              variant={userRole === "provider" ? "default" : "outline"}
              onClick={() => setUserRole("provider")}
              className={`w-full ${
                userRole === "provider" ? "bg-blue-600 text-white" : ""
              }`}
            >
              I am a Healthcare Provider
            </Button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              {/* Date of Birth */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              {/* Phone Number */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="(123) 456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Location Fields */}
            <fieldset className="border rounded-lg p-4 grid md:grid-cols-2 gap-4">
              <legend className="text-sm font-medium px-1">
                Location for Recommendations
              </legend>
              <div className="md:col-span-2 grid w-full items-center gap-1.5">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  type="text"
                  id="address"
                  placeholder="123 Health St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  placeholder="Wellville"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  type="text"
                  id="state"
                  placeholder="Medison"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="zipCode">Zip / Postal Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  placeholder="12345"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>
            </fieldset>

            {/* Provider-Specific Fields */}
            {userRole === "provider" && (
              <fieldset className="border rounded-lg p-4 grid md:grid-cols-2 gap-4">
                <legend className="text-sm font-medium px-1">
                  Provider Verification
                </legend>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="medicalLicense">Medical License #</Label>
                  <Input
                    type="text"
                    id="medicalLicense"
                    placeholder="GMC7891234"
                    value={medicalLicense}
                    onChange={(e) => setMedicalLicense(e.target.value)}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    type="text"
                    id="specialization"
                    placeholder="Cardiology"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                  />
                </div>
              </fieldset>
            )}

            {/* Password */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  id="password"
                  placeholder="•••••••• (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
            >
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-medium text-blue-600 hover:underline"
              >
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
