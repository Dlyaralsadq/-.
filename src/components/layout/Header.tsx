"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Globe, LogOut, User, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

interface HeaderProps {
  locale: string;
  userName?: string;
  onMenuToggle: () => void;
}

export default function Header({ locale, userName, onMenuToggle }: HeaderProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const otherLocale = locale === "ar" ? "en" : "ar";

  const handleLogout = async () => {
    await logoutAction();
    router.push(`/${locale}/login`);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-between">
        {/* Left side */}
        <div className="hidden lg:block" />

        {/* Right side actions */}
        <div className="flex items-center gap-2 ms-auto">
          {/* Language toggle */}
          <Link
            href={`/${otherLocale}/dashboard`}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{otherLocale === "ar" ? "العربية" : "English"}</span>
          </Link>

          {/* Notifications */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 end-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                {userName?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">{userName ?? "Admin"}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div
                className={cn(
                  "absolute top-full mt-1 w-44 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-50",
                  locale === "ar" ? "left-0" : "right-0"
                )}
              >
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{t("profile")}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
