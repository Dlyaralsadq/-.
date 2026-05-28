import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDoctorByUserId, getDoctorAppointments, getDoctorPatients } from "@/app/actions/doctorPortal";
import DoctorAppointmentsClient from "./DoctorAppointmentsClient";

export default async function DoctorAppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireAuth(locale);

  if (session.role !== "doctor") redirect(`/${locale}/admin`);

  const doctor = await getDoctorByUserId(session.userId);
  if (!doctor) redirect(`/${locale}/login`);

  const [appointments, patients] = await Promise.all([
    getDoctorAppointments(doctor.id),
    getDoctorPatients(doctor.id),
  ]);

  return (
    <DashboardLayout locale={locale} userName={session.name} role="doctor">
      <DoctorAppointmentsClient
        appointments={appointments}
        patients={patients}
        doctorId={doctor.id}
        locale={locale}
      />
    </DashboardLayout>
  );
}
