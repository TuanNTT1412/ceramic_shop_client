import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] font-sans text-text-body antialiased selection:bg-sahara-primary-light selection:text-sahara-primary">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
