import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -start-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -end-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-white/95 backdrop-blur shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <span className="text-3xl">🏥</span>
            </div>
            <h1 className="text-2xl font-bold">
              {locale === "ar" ? "كلينيك برو" : "ClinicPro"}
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              {locale === "ar" ? "نظام إدارة العيادات الطبية" : "Medical Clinic Management"}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900">{t("welcomeBack")}</h2>
              <p className="mt-1 text-sm text-gray-500">{t("loginSubtitle")}</p>
            </div>
            <LoginForm locale={locale} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          {locale === "ar"
            ? "© 2024 كلينيك برو. جميع الحقوق محفوظة."
            : "© 2024 ClinicPro. All rights reserved."}
        </p>
      </div>
    </div>
  );
}
