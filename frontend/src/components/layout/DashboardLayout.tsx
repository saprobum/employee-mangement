import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';
import ThemeCustomizer from './ThemeCustomizer';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - Fixed */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar - Fixed */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-6 mt-16">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Theme Customizer Overlay */}
      <ThemeCustomizer />
    </div>
  );
};

export default DashboardLayout;
