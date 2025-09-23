// In: app/(provider)/patients/new/page.tsx

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/provider/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  PersonStanding,
  Loader2,
  PlusCircle,
  AlertTriangle,
  Stethoscope,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NewPatientPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for form inputs
  const [fullName, setFullName] = useState("");
  const [part, setPart] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const patientData = { name: fullName, part, gender, email, phone };

    try {
      const response = await fetch("/api/provider/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create patient.");
      }

      router.push("/patients");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Responsive main container
    <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-4  sm:p-6 lg:p-8 lg:py-16">
      <div className="w-full max-w-3xl">
        <PageHeader
          title="Add New Patient"
          subtitle="Create a new patient record in the system."
        />

        {error && (
          <Alert variant="destructive" className="my-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Creating Patient</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <Card className="overflow-hidden rounded-2xl shadow-lg border-gray-200">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-700" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Patient Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              {/* Full Name */}
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="e.g., John Doe"
                  required
                  className="h-11 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Body Part & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="part" className="text-sm font-medium text-gray-700">
                    Affected Body Part
                  </Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <select
                      id="part"
                      className="appearance-none flex h-11 w-full rounded-md border border-gray-300 bg-white pl-10 pr-8 py-2 text-base ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={part}
                      onChange={(e) => setPart(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a part...</option>
                      <option value="Chest">Chest</option>
                      <option value="Brain">Brain</option>
                      <option value="Skin">Skin</option>
                    </select>
                  </div>
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Gender
                  </Label>
                  <div className="relative">
                    <PersonStanding className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <select
                      id="gender"
                      className="appearance-none flex h-11 w-full rounded-md border border-gray-300 bg-white pl-10 pr-8 py-2 text-base ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select gender...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., patient@email.com"
                      className="h-11 pl-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g., (123) 456-7890"
                      className="h-11 pl-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-6 py-3 rounded-lg shadow-md transition-all hover:scale-105 w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving Record...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Save Patient Record
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default NewPatientPage;