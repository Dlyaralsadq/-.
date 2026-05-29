"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Globe, LogOut, Bell, ChevronDown, ShieldCheck, Stethoscope } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

interface HeaderProps { locale: string; userName?: string; onMenuToggle: () => void; role?: string; }

export default function Header({ locale, userName, onMenuToggle, role = "admin" }: HeaderProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const ar = locale === "ar";
  const otherLocale = ar ? "en" : "ar";
  const switchHref = role === "doctor" ? `/${otherLocale}/doctor` : role === "secretary" ? `/${otherLocale}/secretary` : `/${otherLocale}/admin`;

  const handleLogout = async () => { await logoutAction(); router.push(`/${locale}/login`); };

  const roleLabel = role === "doctor" ? (ar ? "طبيب" : "Doctor") : role === "secretary" ? (ar ? "سكرتير" : "Secretary") : (ar ? "مدير" : "Admin");

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-[#1e2536] bg-[#0b0e1a]/95 backdrop-blur-md px-4">
      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 lg:hidden" onClick={onMenuToggle}>
        <Menu className="h-4.5 w-4.5" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Link href={switchHref} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{otherLocale === "ar" ? "العربية" : "English"}</span>
        </Link>

        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 end-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
        </button>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-colors">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold",
              role === "doctor" ? "bg-indigo-600" : role === "secretary" ? "bg-violet-600" : "bg-blue-600"
            )}>
              {userName?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="hidden sm:block text-start">
              <p className="text-xs font-medium text-slate-200 leading-tight">{userName ?? "User"}</p>
              <p className="text-xs text-slate-500 leading-tight">{roleLabel}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>

          {showMenu && (
            <div className={cn("absolute top-full mt-1 w-44 rounded-xl bg-[#111827] border border-[#2a3347] shadow-2xl py-1 z-50",
              ar ? "left-0" : "right-0")}>
              <div className="px-4 py-2.5 border-b border-[#2a3347]">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-slate-500">{roleLabel}</p>
              </div>
              <button onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut className="h-4 w-4" />{ar ? "تسجيل الخروج" : "Sign Out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
