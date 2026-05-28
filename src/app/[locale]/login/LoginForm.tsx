"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import Button from "@/components/ui/Button";

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      // Redirect based on role
      if (result.role === "doctor") {
        router.push(`/${locale}/doctor`);
      } else {
        router.push(`/${locale}/admin`);
      }
      router.refresh();
    } else {
      setError(t("loginError"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          {t("username")}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
            <User className="h-4 w-4" />
          </span>
          <input
            id="username" name="username" type="text" required autoComplete="username"
            className="w-full rounded-lg border border-gray-300 ps-10 pe-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={t("username")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t("password")}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
            <Lock className="h-4 w-4" />
          </span>
          <input
            id="password" name="password" type={showPassword ? "text" : "password"}
            required autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 ps-10 pe-10 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={t("password")}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full py-2.5" loading={loading}>
        {t("loginButton")}
      </Button>

      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs text-gray-500 space-y-1">
        <p className="font-medium text-gray-600">{locale === "ar" ? "بيانات تجريبية:" : "Demo credentials:"}</p>
        <p>👤 {locale === "ar" ? "المدير:" : "Admin:"} <span className="font-mono font-semibold text-gray-700">admin / admin123</span></p>
        <p>🩺 {locale === "ar" ? "طبيب:" : "Doctor:"} <span className="font-mono font-semibold text-gray-700">dr.ahmad / admin123</span></p>
      </div>
    </form>
  );
}
