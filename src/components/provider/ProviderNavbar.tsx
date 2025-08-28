"use client";
import React, { useState } from 'react';
import { Stethoscope, Bell, User, ChevronDown, Settings, LogOut } from 'lucide-react';

export const ProviderNavbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-blue-900">AnYa-Meds Portal</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="relative">
          <button className="flex items-center space-x-2" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Dr. Smith</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 border border-gray-200">
              <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Settings className="w-4 h-4 mr-2" />Settings</a>
              <div className="border-t border-gray-200 my-1"></div>
              <a href="/" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><LogOut className="w-4 h-4 mr-2" />Sign out</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
