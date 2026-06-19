import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAdminStats, getDoctorsWithAccounts } from "@/app/actions/admin";
import { getSpecialties } from "@/app/actions/doctors";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireAuth(locale);

  if (session.role !== "admin") redirect(`/${locale}/doctor`);

  const [stats, doctors, specialties] = await Promise.all([
    getAdminStats(),
    getDoctorsWithAccounts(),
    getSpecialties(),
  ]);

  return (
    <DashboardLayout locale={locale} userName={session.name} role="admin">
      <AdminDashboardClient
        stats={stats}
        doctors={doctors}
        specialties={specialties}
        locale={locale}
      />
    </DashboardLayout>
  );
}
