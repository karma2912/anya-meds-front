"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  MapPin,
  Phone,
  Star,
  Clock,
  Crosshair,
  ArrowLeft,
} from "lucide-react";
import { debounce } from "lodash";
import Link from "next/link";

// Define the Doctor type for this page
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  rating?: number;
  availability?: string;
}

// A wrapper component to ensure useSearchParams is used within a Suspense boundary
const FindDoctorPageContent = () => {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.2, 79.8]); // Centered on India
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const searchParams = useSearchParams();

  const DoctorMap = useMemo(
    () =>
      dynamic(() => import("@/components/DoctorMap"), {
        loading: () => (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <p className="text-gray-500">Loading Map...</p>
          </div>
        ),
        ssr: false,
      }),
    []
  );

  // Fetch all doctor data once on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/doctors.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Add some mock ratings and availability
        const doctorsWithDetails = data.map((doctor: Doctor) => ({
          ...doctor,
          rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0 and 5.0
          availability:
            Math.random() > 0.3 ? "Available Today" : "Available Tomorrow",
        }));
        setAllDoctors(doctorsWithDetails);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors when the page loads or the specialty in the URL changes
  useEffect(() => {
    const specialty =
      searchParams.get("specialty") || searchParams.get("specialty"); // Handle typo
    if (allDoctors.length > 0) {
      if (specialty) {
        const filtered = allDoctors.filter(
          (doctor) =>
            doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes("multi-specialty") // Always include hospitals
        );
        setFilteredDoctors(filtered);
      } else {
        setFilteredDoctors(allDoctors); // If no specialty, show all
      }
    }
  }, [allDoctors, searchParams]);

  // Debounced location search
  const searchLocation = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=in`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setMapCenter([parseFloat(lat), parseFloat(lon)]);
          setMapZoom(12); // Zoom in to the city level
        }
      } catch (error) {
        console.error("Failed to geocode location:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  // Handle the location search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      searchLocation(query);
    }
  };

  // Handle manual search button click
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchLocation(searchQuery);
    }
  };

  // Handle current location button click
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
        setMapZoom(14);
        setIsGeolocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
        setIsGeolocating(false);
      }
    );
  };

  // Handle doctor card click
  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setMapCenter([doctor.lat, doctor.lng]);
    setMapZoom(15);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="absolute top-8 left-4">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
            Find a Specialist
          </h1>
          <p className="text-gray-600 text-md sm:text-lg">
            Search for doctors and clinics in your area
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter a city or address..."
                disabled={isLoading}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
            <Button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isGeolocating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Crosshair className="w-4 h-4" />
              <span className="hidden sm:inline">My Location</span>
            </Button>
          </form>
          {isLoading && (
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching for locations...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Column */}
          <div className="lg:col-span-2 w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <DoctorMap
              doctors={filteredDoctors}
              center={mapCenter}
              zoom={mapZoom}
              selectedDoctor={selectedDoctor}
            />
          </div>

          {/* List Column */}
          <div className="h-[600px] overflow-y-auto pr-2">
            <Card className="border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="flex justify-between items-center">
                  <span>Showing {filteredDoctors.length} Results</span>
                  {searchParams.get("specialty") && (
                    <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {searchParams.get("specialty")}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-0">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer ${
                        selectedDoctor?.id === doctor.id
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                      onClick={() => handleDoctorClick(doctor)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-md text-blue-700">
                            {doctor.name}
                          </h3>
                          <p className="text-sm font-semibold text-gray-600">
                            {doctor.specialty}
                          </p>
                        </div>
                        {doctor.rating && (
                          <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {doctor.rating}
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-2 mt-2 text-xs text-gray-500">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{doctor.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Phone className="w-4 h-4" />
                        <span>{doctor.phone}</span>
                      </div>
                      {doctor.availability && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-green-600">
                          <Clock className="w-4 h-4" />
                          <span>{doctor.availability}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      No doctors found matching your criteria.
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or specialty filter.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main page component that wraps the content in Suspense
const FindDoctorPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-600">Loading doctor information...</p>
          </div>
        </div>
      }
    >
      <FindDoctorPageContent />
    </Suspense>
  );
};

export default FindDoctorPage;
