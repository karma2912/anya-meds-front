"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // --- Mock Logic ---
    // In a real app, you would first verify email/password.
    // If they are correct AND 2FA is enabled for the user,
    // then you would show the 2FA input.
    if (!showTwoFactor) {
      console.log("Verifying credentials for:", { email, password });
      // Assuming credentials are correct, show 2FA input
      setShowTwoFactor(true);
    } else {
      // Now, verify the 2FA code
      console.log("Verifying 2FA code:", { twoFactorCode });
      // On successful login, redirect
      // router.push('/dashboard');
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
            {showTwoFactor ? "Two-Factor Authentication" : "Secure Login"}
          </h1>
          <p className="text-gray-600 mt-2">
            {showTwoFactor
              ? "Enter the code from your authenticator app."
              : "Welcome back to your secure account."}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {!showTwoFactor ? (
              <>
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
              </>
            ) : (
              <>
                {/* 2FA Code Input */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="twoFactorCode">Authentication Code</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      id="twoFactorCode"
                      placeholder="123456"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      required
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="pl-10 tracking-widest text-center"
                    />
                  </div>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-blue-600"
                  onClick={() => setShowTwoFactor(false)}
                >
                  Back to password
                </Button>
              </>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {showTwoFactor ? "Verify Code" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign Up
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

export default LoginPage;
