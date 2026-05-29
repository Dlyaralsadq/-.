import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDoctorByUserId } from "@/app/actions/doctorPortal";
import { getTodayQueue, getWaitingRoomData } from "@/app/actions/clinic";
import DoctorClinicClient from "./DoctorClinicClient";

export default async function DoctorPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireAuth(locale);

  if (session.role !== "doctor") redirect(`/${locale}/admin`);

  const doctor = await getDoctorByUserId(session.userId);
  if (!doctor) redirect(`/${locale}/login`);

  const [queue, roomData] = await Promise.all([
    getTodayQueue(doctor.id),
    getWaitingRoomData(doctor.id),
  ]);

  return (
    <DashboardLayout locale={locale} userName={session.name} role="doctor">
      <DoctorClinicClient
        doctor={doctor}
        queue={queue}
        roomData={roomData}
        locale={locale}
      />
    </DashboardLayout>
  );
}
