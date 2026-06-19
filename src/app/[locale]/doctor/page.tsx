import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDoctorByUserId } from "@/app/actions/doctorPortal";
import { getTodaySyncedQueue } from "@/app/actions/clinic";
import { getSpecialtyConfig } from "@/lib/specialtyConfig";
import DoctorClinicClient from "./DoctorClinicClient";

export default async function DoctorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireAuth(locale);

  if (session.role !== "doctor") redirect(`/${locale}/admin`);

  const doctor = await getDoctorByUserId(session.userId);
  if (!doctor) redirect(`/${locale}/login`);

  const [queue, recurringCount] = await Promise.all([
    getTodaySyncedQueue(doctor.id),
    (await import("@/lib/prisma")).prisma.patient.count({ where: { doctorId: doctor.id, isRecurring: true } }),
  ]);
  const specialtyConfig = getSpecialtyConfig(doctor.specialty.name, (doctor.specialty as any).config);

  return (
    <DashboardLayout locale={locale} userName={session.name} role="doctor" doctorSpecialty={doctor.specialty.name} recurringCount={recurringCount}>
      <DoctorClinicClient doctor={doctor} queue={queue as any} locale={locale} specialtyConfig={specialtyConfig} />
    </DashboardLayout>
  );
}
