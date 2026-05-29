"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Calendar, Stethoscope, ClipboardList, Heart, ShieldCheck, ChevronRight, Tv2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface SidebarProps { locale: string; isOpen: boolean; onClose: () => void; role?: string; }

export default function Sidebar({ locale, isOpen, onClose, role = "admin" }: SidebarProps) {
  const tn = useTranslations("nav");
  const ta = useTranslations("admin");
  const td = useTranslations("doctorPortal");
  const pathname = usePathname();
  const ar = locale === "ar";

  const adminNav = [
    { href: `/${locale}/admin`, icon: ShieldCheck, label: ta("title"), exact: true },
    { href: `/${locale}/specialties`, icon: ClipboardList, label: tn("specialties") },
  ];

  const doctorNav = [
    { href: `/${locale}/doctor`, icon: LayoutDashboard, label: ar ? "لوحة الطبيب" : "Doctor Board", exact: true },
    { href: `/${locale}/secretary`, icon: ClipboardList, label: ar ? "الاستقبال" : "Reception" },
    { href: `/${locale}/doctor/patients`, icon: Users, label: td("myPatients") },
    { href: `/${locale}/doctor/appointments`, icon: Calendar, label: ar ? "سجل المواعيد" : "Appointments Log" },
  ];

  const secretaryNav = [
    { href: `/${locale}/secretary`, icon: ClipboardList, label: ar ? "الاستقبال" : "Reception", exact: true },
  ];

  const navItems = role === "doctor" ? doctorNav : role === "secretary" ? secretaryNav : adminNav;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const accentColor = role === "doctor" ? "indigo" : role === "secretary" ? "violet" : "blue";
  const accentBg: Record<string, string> = {
    indigo: "bg-indigo-600 shadow-indigo-900/40",
    violet: "bg-violet-600 shadow-violet-900/40",
    blue: "bg-blue-600 shadow-blue-900/40",
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside className={cn(
        "fixed inset-y-0 z-30 flex w-64 flex-col border-e border-[#1e2536] transition-transform duration-300 lg:static lg:translate-x-0",
        "bg-[#080c18]",
        locale === "ar"
          ? cn("right-0", isOpen ? "translate-x-0" : "translate-x-full")
          : cn("left-0", isOpen ? "translate-x-0" : "-translate-x-full")
      )}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1e2536]">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shadow-lg", accentBg[accentColor])}>
            {role === "doctor" ? <Stethoscope className="h-4.5 w-4.5 text-white" /> : <Heart className="h-4.5 w-4.5 text-white" />}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{ar ? "كلينيك برو" : "ClinicPro"}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {role === "doctor" ? (ar ? "بوابة الطبيب" : "Doctor Portal")
                : role === "secretary" ? (ar ? "الاستقبال" : "Reception")
                : (ar ? "لوحة الإدارة" : "Admin Panel")}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link key={href} href={href} onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}>
                <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-indigo-400" : "text-slate-600")} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 opacity-60 rtl:rotate-180" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-[#1e2536]">
          <p className="text-xs text-slate-600">ClinicPro v1.0</p>
        </div>
      </aside>
    </>
  );
}
