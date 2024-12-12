import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - Fixed at top */}
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Desktop Sidebar - Fixed position */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="h-full fixed w-64 border-r border-gray-200">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
        </div>

        {/* Mobile Menu - Overlay */}
        <MobileMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}