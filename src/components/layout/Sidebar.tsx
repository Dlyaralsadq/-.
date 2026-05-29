"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Calendar, Stethoscope,
  ClipboardList, ChevronRight, Heart, ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  role?: string;
}

export default function Sidebar({ locale, isOpen, onClose, role = "admin" }: SidebarProps) {
  const tn = useTranslations("nav");
  const ta = useTranslations("admin");
  const td = useTranslations("doctorPortal");
  const pathname = usePathname();

  const adminNav = [
    { href: `/${locale}/admin`, label: ta("title"), icon: ShieldCheck, exact: true },
    { href: `/${locale}/specialties`, label: tn("specialties"), icon: ClipboardList },
  ];

  const doctorNav = [
    { href: `/${locale}/doctor`, label: tn("dashboard"), icon: LayoutDashboard, exact: true },
    { href: `/${locale}/secretary`, label: locale === "ar" ? "الاستقبال" : "Reception", icon: ClipboardList },
    { href: `/${locale}/doctor/patients`, label: td("myPatients"), icon: Users },
    { href: `/${locale}/doctor/appointments`, label: td("myAppointments"), icon: Calendar },
  ];

  const secretaryNav = [
    { href: `/${locale}/secretary`, label: locale === "ar" ? "الاستقبال" : "Reception", icon: LayoutDashboard, exact: true },
  ];

  const navItems = role === "doctor" ? doctorNav : role === "secretary" ? secretaryNav : adminNav;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        "fixed inset-y-0 z-30 flex w-64 flex-col transition-transform duration-300 lg:static lg:translate-x-0",
        role === "doctor"
          ? "bg-gradient-to-b from-indigo-900 to-indigo-800"
          : "bg-gradient-to-b from-slate-900 to-slate-800",
        locale === "ar"
          ? cn("right-0", isOpen ? "translate-x-0" : "translate-x-full")
          : cn("left-0", isOpen ? "translate-x-0" : "-translate-x-full")
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            role === "doctor" ? "bg-indigo-500" : "bg-blue-500"
          )}>
            {role === "doctor" ? <Stethoscope className="h-5 w-5 text-white" /> : <Heart className="h-5 w-5 text-white" />}
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-none">
              {locale === "ar" ? "كلينيك برو" : "ClinicPro"}
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              {role === "doctor"
                ? (locale === "ar" ? "بوابة الطبيب" : "Doctor Portal")
                : (locale === "ar" ? "لوحة المدير" : "Admin Panel")}
            </p>
          </div>
        </div>

        {/* Role badge */}
        <div className="mx-4 mt-4">
          <div className={cn(
            "rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-2",
            role === "doctor" ? "bg-indigo-700/50 text-indigo-200" : "bg-slate-700/50 text-slate-300"
          )}>
            {role === "doctor"
              ? <><Stethoscope className="h-3.5 w-3.5" />{locale === "ar" ? "طبيب" : "Doctor"}</>
              : <><ShieldCheck className="h-3.5 w-3.5" />{locale === "ar" ? "مدير النظام" : "System Admin"}</>
            }
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? role === "doctor"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-blue-600 text-white shadow-lg"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}>
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-white/30">ClinicPro v1.0</p>
        </div>
      </aside>
    </>
  );
}
