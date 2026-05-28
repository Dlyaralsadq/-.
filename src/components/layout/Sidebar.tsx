"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  ClipboardList,
  ChevronRight,
  Heart,
} from "lucide-react";

interface SidebarProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ locale, isOpen, onClose }: SidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}/dashboard`, label: t("dashboard"), icon: LayoutDashboard },
    { href: `/${locale}/patients`, label: t("patients"), icon: Users },
    { href: `/${locale}/appointments`, label: t("appointments"), icon: Calendar },
    { href: `/${locale}/doctors`, label: t("doctors"), icon: Stethoscope },
    { href: `/${locale}/specialties`, label: t("specialties"), icon: ClipboardList },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-30 flex w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300 lg:static lg:translate-x-0",
          locale === "ar"
            ? cn("right-0", isOpen ? "translate-x-0" : "translate-x-full")
            : cn("left-0", isOpen ? "translate-x-0" : "-translate-x-full")
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-none">
              {locale === "ar" ? "كلينيك برو" : "ClinicPro"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {locale === "ar" ? "إدارة العيادات" : "Clinic Management"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Version */}
        <div className="px-6 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">ClinicPro v1.0</p>
        </div>
      </aside>
    </>
  );
}
