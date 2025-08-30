"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, Bell, User, ChevronDown, Settings, LogOut, LayoutDashboard, FolderKanban, Users, Menu, X } from 'lucide-react';

export const ProviderNavbar = () => {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const getLinkClass = (path: string) => {
        const isActive = pathname.startsWith(path);
        return `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive 
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
        }`;
    };

    const getMobileLinkClass = (path: string) => {
        const isActive = pathname.startsWith(path);
        return `flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
            isActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
        }`;
    };

    return (
        <>
            <nav className="bg-white border-b border-blue-100 px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                {/* Left Section: Logo and Mobile Menu Button */}
                <div className="flex items-center space-x-4">
                    <button 
                        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    
                    <Link href="/dashboard" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-blue-900">AnYa-Meds</span>
                        </div>
                    </Link>
                </div>

                {/* Center Section: Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center gap-1">
                    <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                    </Link>
                    <Link href="/case-review" className={getLinkClass('/case-review')}>
                        <FolderKanban className="w-4 h-4 mr-2" />
                        Case Review
                    </Link>
                    <Link href="/patients" className={getLinkClass('/patients')}>
                        <Users className="w-4 h-4 mr-2" />
                        Patients
                    </Link>
                    <Link href="/settings" className={getLinkClass('/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Link>
                </div>

                {/* Right Section: Notifications and Profile */}
                <div className="flex items-center space-x-3">
                    <button className="relative p-2 text-gray-500 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    
                    <div className="relative">
                        <button 
                            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        >
                            <div className="w-9 h-9 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center border border-blue-200">
                                <User className="w-4 h-4 text-blue-700" />
                            </div>
                            <div className="hidden sm:flex flex-col items-start">
                                <span className="text-sm font-medium text-gray-800">Dr. Smith</span>
                                <span className="text-xs text-gray-500">Cardiologist</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-40 border border-blue-100">
                                <div className="px-4 py-2 border-b border-blue-100">
                                    <p className="text-sm font-medium text-gray-800">Dr. Alexandra Smith</p>
                                    <p className="text-xs text-gray-500">alex.smith@medscan.com</p>
                                </div>
                                
                                <Link 
                                    href="/profile" 
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                    onClick={() => setShowProfileDropdown(false)}
                                >
                                    <User className="w-4 h-4 mr-3 text-gray-500" />
                                    My Profile
                                </Link>
                                
                                <Link 
                                    href="/settings" 
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                    onClick={() => setShowProfileDropdown(false)}
                                >
                                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                                    Settings
                                </Link>
                                
                                <div className="border-t border-blue-100 my-1"></div>
                                
                                <Link 
                                    href="/logout" 
                                    className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    onClick={() => setShowProfileDropdown(false)}
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Sign Out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-blue-100 shadow-md">
                    <div className="px-4 py-3 space-y-1">
                        <Link 
                            href="/dashboard" 
                            className={getMobileLinkClass('/dashboard')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>
                        <Link 
                            href="/case-review" 
                            className={getMobileLinkClass('/case-review')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FolderKanban className="w-5 h-5 mr-3" />
                            Case Review
                        </Link>
                        <Link 
                            href="/patients" 
                            className={getMobileLinkClass('/patients')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Users className="w-5 h-5 mr-3" />
                            Patients
                        </Link>
                        <Link 
                            href="/analysis" 
                            className={getMobileLinkClass('/analysis')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FolderKanban className="w-5 h-5 mr-3" />
                            Analysis
                        </Link>
                        <Link 
                            href="/settings" 
                            className={getMobileLinkClass('/settings')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};