import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleOpenMobile = () => {
    setIsMobileOpen(true);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-background selection:bg-primary/20 selection:text-primary">
      {/* 1. Admin Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      {/* 2. Admin Header */}
      <AdminHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        onOpenMobile={handleOpenMobile}
      />

      {/* 3. Main Content Workspace */}
      <div
        className={`transition-all duration-300 min-h-screen pt-16 ${
          isCollapsed ? 'pl-0 lg:pl-20' : 'pl-0 lg:pl-64'
        }`}
      >
        <main className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

