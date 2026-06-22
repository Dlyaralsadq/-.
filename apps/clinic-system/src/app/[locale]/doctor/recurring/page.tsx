import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDoctorByUserId } from "@/app/actions/doctorPortal";
import { prisma } from "@/lib/prisma";
import RecurringPatientsClient from "./RecurringPatientsClient";
import { getSpecialtyConfig } from "@/lib/specialtyConfig";

export default async function RecurringPatientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireAuth(locale);

  if (session.role !== "doctor") redirect(`/${locale}/admin`);

  const doctor = await getDoctorByUserId(session.userId);
  if (!doctor) redirect(`/${locale}/login`);

  const specialtyConfig = getSpecialtyConfig(doctor.specialty.name, (doctor.specialty as any).config);
  const treatmentTypes = specialtyConfig.recurringTreatmentTypes ?? [
    { value: "recurring", labelAr: "علاج متكرر", labelEn: "Recurring Treatment" },
    { value: "followup", labelAr: "متابعة دورية", labelEn: "Periodic Follow-up" },
  ];

  const recurringPatients = await prisma.patient.findMany({
    where: { doctorId: doctor.id, isRecurring: true },
    include: { _count: { select: { appointments: true } } },
    orderBy: { nextVisitDate: "asc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <DashboardLayout locale={locale} userName={session.name} role="doctor" doctorSpecialty={doctor.specialty.name}>
      <RecurringPatientsClient
        patients={recurringPatients as any}
        doctorId={doctor.id}
        locale={locale}
        today={today.toISOString()}
        treatmentTypes={treatmentTypes}
      />
    </DashboardLayout>
  );
}
