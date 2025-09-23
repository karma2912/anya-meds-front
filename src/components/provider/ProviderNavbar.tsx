"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// --- Refinement 1: Consolidate next-auth imports ---
import { useSession, signOut } from 'next-auth/react'; 
import { 
    Stethoscope, Bell, User, ChevronDown, Settings, LogOut, 
    LayoutDashboard, FolderKanban, Users, Menu, X 
} from 'lucide-react';

const ProfileSkeleton = () => (
    <div className="flex items-center space-x-3 animate-pulse">
        <div className="p-2 bg-gray-200 rounded-full h-9 w-9"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
    </div>
);

export const ProviderNavbar = () => {
    const { data: session, status } = useSession();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    
    // --- Refinement 2: Memoize link class function if component re-renders often ---
    // For this app, your original approach is perfectly fine.
    const getLinkClass = (path: string) => {
        const isActive = pathname === path;
        return `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
        }`;
    };

    const getMobileLinkClass = (path: string) => {
        const isActive = pathname === path;
        return `flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
            isActive 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
        }`;
    };
    
    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    const user = session?.user;

    return (
        <>
            <nav className="bg-white border-b border-blue-100 px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <button 
                        className="md:hidden p-2 rounded-md text-gray-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <Link href="/dashboard" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-blue-900">AnYa-Meds</span>
                    </Link>
                </div>

                {/* Center Section (Desktop Nav) */}
                <div className="hidden md:flex items-center gap-1">
                    <Link href="/dashboard" className={getLinkClass('/dashboard')}>
                        <LayoutDashboard size={16} className="mr-2" /> Dashboard
                    </Link>
                    <Link href="/case-review" className={getLinkClass('/case-review')}>
                        <FolderKanban size={16} className="mr-2" /> Case Review
                    </Link>
                    <Link href="/patients" className={getLinkClass('/patients')}>
                        <Users size={16} className="mr-2" /> Patients
                    </Link>
                    <Link href="/settings" className={getLinkClass('/settings')}>
                        <Settings size={16} className="mr-2" /> Settings
                    </Link>
                </div>
                
                {/* Right Section (Profile) */}
                <div className="flex items-center space-x-3">
                    {status === 'loading' && <ProfileSkeleton />}
                    
                    {status === 'authenticated' && user && (
                        <>
                            <button className="relative p-2 text-gray-500 hover:text-blue-700 rounded-full hover:bg-blue-50">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            
                            <div className="relative">
                                <button 
                                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-blue-50"
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                >
                                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                                        <User size={16} className="text-blue-700" />
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start">
                                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                                        <span className="text-xs text-gray-500 capitalize">{user.role || 'Provider'}</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-40 border border-blue-100">
                                        <div className="px-4 py-2 border-b border-blue-100">
                                            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link href="/settings" className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50" onClick={() => setShowProfileDropdown(false)}>
                                            <Settings size={16} className="mr-3 text-gray-500" /> Settings
                                        </Link>
                                        <div className="border-t border-blue-100 my-1"></div>
                                        <button className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50" onClick={handleLogout}>
                                            <LogOut size={16} className="mr-3" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-blue-100 shadow-md">
                    <div className="px-4 py-3 space-y-1">
                        <Link href="/dashboard" className={getMobileLinkClass('/dashboard')} onClick={() => setMobileMenuOpen(false)}>
                            <LayoutDashboard size={20} className="mr-3" /> Dashboard
                        </Link>
                        <Link href="/case-review" className={getMobileLinkClass('/case-review')} onClick={() => setMobileMenuOpen(false)}>
                            <FolderKanban size={20} className="mr-3" /> Case Review
                        </Link>
                        <Link href="/patients" className={getMobileLinkClass('/patients')} onClick={() => setMobileMenuOpen(false)}>
                            <Users size={20} className="mr-3" /> Patients
                        </Link>
                        <Link href="/settings" className={getMobileLinkClass('/settings')} onClick={() => setMobileMenuOpen(false)}>
                            <Settings size={20} className="mr-3" /> Settings
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};