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
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI State for feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      // On successful login, redirect to the dashboard
      console.log("Login successful:", data);
      router.push('/dashboard'); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-900">AnYa-Meds</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Provider Portal Login
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back. Please enter your credentials.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
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

            {/* Password Input */}
            <div className="grid w-full items-center gap-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  tabIndex={-1}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
