import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDoctorByUserId } from "@/app/actions/doctorPortal";
import { getMessagesForUser, getUnreadCount, getAdminUserId } from "@/app/actions/messages";
import DoctorSettingsClient from "./DoctorSettingsClient";

export default async function DoctorSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireAuth(locale);
  if (session.role !== "doctor") redirect(`/${locale}/admin`);

  const doctor = await getDoctorByUserId(session.userId);
  if (!doctor) redirect(`/${locale}/login`);

  const [messages, unreadCount, adminUserId] = await Promise.all([
    getMessagesForUser(session.userId),
    getUnreadCount(session.userId),
    getAdminUserId(),
  ]);

  return (
    <DashboardLayout locale={locale} userName={session.name} role="doctor"
      doctorSpecialty={doctor.specialty.name}
      userId={session.userId} messages={messages as any} unreadCount={unreadCount}
      adminUserId={adminUserId ?? undefined}>
      <DoctorSettingsClient doctor={doctor as any} locale={locale} />
    </DashboardLayout>
  );
}
