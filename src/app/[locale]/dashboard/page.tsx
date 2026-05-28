import { getTranslations } from "next-intl/server";
import { requireAuth } from "@/lib/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDashboardStats } from "@/app/actions/appointments";
import { Users, Calendar, Stethoscope, Clock, TrendingUp, Plus } from "lucide-react";
import { formatDate, formatTime, getStatusColor } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireAuth(locale);
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const ta = await getTranslations({ locale, namespace: "appointments" });

  const stats = await getDashboardStats();

  const statCards = [
    {
      title: t("totalPatients"),
      value: stats.totalPatients,
      icon: Users,
      color: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      change: "+12%",
    },
    {
      title: t("todayAppointments"),
      value: stats.todayAppointments,
      icon: Calendar,
      color: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
      change: "+5%",
    },
    {
      title: t("totalDoctors"),
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: "bg-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
      change: "نشط",
    },
    {
      title: t("pendingAppointments"),
      value: stats.pendingAppointments,
      icon: Clock,
      color: "bg-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
      change: "بانتظار التأكيد",
    },
  ];

  const appointmentStatusMap: Record<string, string> = {
    scheduled: ta("scheduled"),
    confirmed: ta("confirmed"),
    completed: ta("completed"),
    cancelled: ta("cancelled"),
    noShow: ta("noShow"),
  };

  return (
    <DashboardLayout locale={locale} userName={session.name}>
      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {locale === "ar"
                ? `مرحباً، ${session.name} 👋`
                : `Welcome back, ${session.name} 👋`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/patients`}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              {t("addPatient")}
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingUp className={`h-3 w-3 ${card.text}`} />
                      <span className={`text-xs font-medium ${card.text}`}>{card.change}</span>
                    </div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}>
                    <Icon className={`h-6 w-6 ${card.text}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Upcoming appointments */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold text-gray-900">{t("upcomingAppointments")}</h2>
              <Link
                href={`/${locale}/appointments`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t("viewAll")}
              </Link>
            </div>
            <div className="divide-y">
              {stats.upcomingAppointments.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  {tc("noData")}
                </div>
              ) : (
                stats.upcomingAppointments.slice(0, 6).map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {apt.patient.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{apt.patient.name}</p>
                      <p className="text-xs text-gray-500">
                        {locale === "ar" ? apt.doctor.nameAr : apt.doctor.name} •{" "}
                        {locale === "ar" ? apt.doctor.specialty.nameAr : apt.doctor.specialty.name}
                      </p>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-xs font-medium text-gray-700">{formatDate(apt.date, locale)}</p>
                      <p className="text-xs text-gray-500">{formatTime(apt.date, locale)}</p>
                    </div>
                    <span className={`shrink-0 badge ${getStatusColor(apt.status)}`}>
                      {appointmentStatusMap[apt.status] ?? apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent patients */}
          <div className="card">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold text-gray-900">{t("recentPatients")}</h2>
              <Link
                href={`/${locale}/patients`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t("viewAll")}
              </Link>
            </div>
            <div className="divide-y">
              {stats.recentPatients.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  {tc("noData")}
                </div>
              ) : (
                stats.recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/${locale}/patients/${patient.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-sm">
                      {patient.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.phone}</p>
                    </div>
                    <span className={`shrink-0 badge ${patient.gender === "male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}>
                      {patient.gender === "male" ? (locale === "ar" ? "ذكر" : "Male") : (locale === "ar" ? "أنثى" : "Female")}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
