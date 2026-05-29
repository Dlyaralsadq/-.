import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();

  if (session) {
    redirect(session.role === "doctor" ? `/${locale}/doctor` : session.role === "secretary" ? `/${locale}/secretary` : `/${locale}/admin`);
  }

  const ar = locale === "ar";

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4" dir={ar ? "rtl" : "ltr"}>
      {/* Decorative orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -start-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -end-32 h-96 w-96 rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-2xl shadow-indigo-900/50 mb-4">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-2xl font-black text-white">{ar ? "كلينيك برو" : "ClinicPro"}</h1>
          <p className="text-sm text-slate-500 mt-1">{ar ? "نظام إدارة العيادات الطبية" : "Medical Clinic Management"}</p>
        </div>

        {/* Card */}
        <div className="card-glass rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">{ar ? "مرحباً بعودتك" : "Welcome back"}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{ar ? "سجّل دخولك للمتابعة" : "Sign in to continue"}</p>
          </div>
          <LoginForm locale={locale} />
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          {ar ? "© 2024 كلينيك برو · جميع الحقوق محفوظة" : "© 2024 ClinicPro · All rights reserved"}
        </p>
      </div>
    </div>
  );
}
