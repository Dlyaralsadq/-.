"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  locale: string;
  userName?: string;
  role?: string;
  doctorSpecialty?: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ locale, userName, role = "admin", doctorSpecialty, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0e1a]">
      <Sidebar locale={locale} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} doctorSpecialty={doctorSpecialty} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header locale={locale} userName={userName} onMenuToggle={() => setSidebarOpen(true)} role={role} />
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
