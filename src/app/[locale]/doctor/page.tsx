import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDoctorByUserId } from "@/app/actions/doctorPortal";
import { getTodaySyncedQueue } from "@/app/actions/clinic";
import DoctorClinicClient from "./DoctorClinicClient";

export default async function DoctorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireAuth(locale);

  if (session.role !== "doctor") redirect(`/${locale}/admin`);

  const doctor = await getDoctorByUserId(session.userId);
  if (!doctor) redirect(`/${locale}/login`);

  const queue = await getTodaySyncedQueue(doctor.id);

  return (
    <DashboardLayout locale={locale} userName={session.name} role="doctor">
      <DoctorClinicClient doctor={doctor} queue={queue as any} locale={locale} />
    </DashboardLayout>
  );
}
