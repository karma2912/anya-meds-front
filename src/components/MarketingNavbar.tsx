"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';
import { Stethoscope, Menu, X } from "lucide-react";

const MarketingNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const handleNavClick = (sectionId: string) => {
    router.push(sectionId);
    setIsMenuOpen(false); // Close menu on navigation
  };
    const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#diagnostics", label: "Diagnostics" },
    { href: "#performance", label: "Performance" },
    { href: "#about", label: "About" },
  ];

  return (
   <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a
              onClick={() => handleNavClick("#home")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">
                AnYa-Meds
              </span>
            </a>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl border-t border-gray-200">
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

  );
};

export default MarketingNavbar;