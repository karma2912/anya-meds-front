"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Stethoscope, Menu, X } from "lucide-react";

const MarketingNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-blue-100 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-14">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-900">AnYa-Meds</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#home" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="/#diagnostics" className="text-gray-700 hover:text-blue-600 transition-colors">
              Diagnostics
            </a>
            <a href="/#performance" className="text-gray-700 hover:text-blue-600 transition-colors">
              Performance
            </a>
            <a href="/#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </a>
            <Link href="/login" passHref>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            <div className="flex flex-col space-y-3">
              <a
                href="/#home"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/#diagnostics"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Diagnostics
              </a>
              <a
                href="/#performance"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Performance
              </a>
              <a
                href="/#about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <Link href="/login" passHref>
                 <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 w-fit"
                  >
                    Sign In
                  </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MarketingNavbar;