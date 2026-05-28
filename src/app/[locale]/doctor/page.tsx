import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDoctorByUserId, getDoctorStats } from "@/app/actions/doctorPortal";
import { formatDate, formatTime, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Calendar, Users, Clock, Plus, Stethoscope, CheckCircle } from "lucide-react";
import Badge, { getAppointmentStatusVariant } from "@/components/ui/Badge";

export default async function DoctorPortalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireAuth(locale);

  if (session.role !== "doctor") redirect(`/${locale}/admin`);

  const doctor = await getDoctorByUserId(session.userId);
  if (!doctor) redirect(`/${locale}/login`);

  const stats = await getDoctorStats(doctor.id);

  const t = await getTranslations({ locale, namespace: "doctorPortal" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const ta = await getTranslations({ locale, namespace: "appointments" });

  const statusLabels: Record<string, string> = {
    scheduled: ta("scheduled"),
    confirmed: ta("confirmed"),
    completed: ta("completed"),
    cancelled: ta("cancelled"),
    noShow: ta("noShow"),
  };

  return (
    <DashboardLayout locale={locale} userName={session.name} role="doctor">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">
                {doctor.name[0]}
              </div>
              <div>
                <p className="text-sm text-blue-100">{t("welcome")}</p>
                <h1 className="text-xl font-bold">{locale === "ar" ? doctor.nameAr : doctor.name}</h1>
                <p className="text-sm text-blue-200 flex items-center gap-1.5 mt-0.5">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {locale === "ar" ? doctor.specialty.nameAr : doctor.specialty.name}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/${locale}/doctor/patients`}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t("addPatient")}
              </Link>
              <Link
                href={`/${locale}/doctor/appointments`}
                className="flex items-center gap-2 rounded-xl bg-white text-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                {t("newAppointment")}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: t("totalPatients"), value: stats.totalPatients, icon: Users, color: "blue", href: `/${locale}/doctor/patients` },
            { label: t("todayAppointments"), value: stats.todayAppointments, icon: Calendar, color: "green", href: `/${locale}/doctor/appointments` },
            { label: t("pendingAppointments"), value: stats.pendingAppointments, icon: Clock, color: "orange", href: `/${locale}/doctor/appointments` },
          ].map(({ label, value, icon: Icon, color, href }) => (
            <Link key={label} href={href} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-1.5 text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${color}-50`}>
                  <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Doctor Info Card */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Upcoming appointments */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold text-gray-900">{t("myAppointments")}</h2>
              <Link href={`/${locale}/doctor/appointments`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                {tc("viewAll") ?? (locale === "ar" ? "عرض الكل" : "View all")}
              </Link>
            </div>
            <div className="divide-y">
              {stats.upcomingAppointments.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-gray-400">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  {tc("noData")}
                </div>
              ) : (
                stats.upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {apt.patient.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{apt.patient.name}</p>
                      <p className="text-xs text-gray-400">{apt.patient.phone}</p>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-xs font-medium text-gray-700">{formatDate(apt.date, locale)}</p>
                      <p className="text-xs text-gray-400">{formatTime(apt.date, locale)}</p>
                    </div>
                    <Badge variant={getAppointmentStatusVariant(apt.status)}>
                      {statusLabels[apt.status] ?? apt.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Doctor profile summary */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              {locale === "ar" ? "بياناتي" : "My Profile"}
            </h2>
            <div className="space-y-3 text-sm">
              {[
                { label: locale === "ar" ? "التخصص" : "Specialty", value: locale === "ar" ? doctor.specialty.nameAr : doctor.specialty.name },
                { label: locale === "ar" ? "رقم الترخيص" : "License", value: doctor.licenseNumber },
                { label: locale === "ar" ? "سنوات الخبرة" : "Experience", value: doctor.experienceYears ? `${doctor.experienceYears} ${locale === "ar" ? "سنة" : "years"}` : null },
                { label: locale === "ar" ? "رسوم الكشف" : "Fee", value: doctor.consultationFee ? `${doctor.consultationFee} ${locale === "ar" ? "ر.س" : "SAR"}` : null },
                { label: locale === "ar" ? "أيام العمل" : "Working Days", value: doctor.workingDays ? (locale === "ar" ? { "sat-thu": "السبت - الخميس", "sun-thu": "الأحد - الخميس", "sat-wed": "السبت - الأربعاء", "mon-fri": "الاثنين - الجمعة" }[doctor.workingDays] : doctor.workingDays) : null },
                { label: locale === "ar" ? "ساعات العمل" : "Hours", value: (doctor.workingHoursStart && doctor.workingHoursEnd) ? `${doctor.workingHoursStart} - ${doctor.workingHoursEnd}` : null },
              ].map(({ label, value }) =>
                value ? (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-gray-400 shrink-0">{label}</span>
                    <span className="font-medium text-gray-800 text-end">{value}</span>
                  </div>
                ) : null
              )}
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium">{locale === "ar" ? "حسابك نشط" : "Your account is active"}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
