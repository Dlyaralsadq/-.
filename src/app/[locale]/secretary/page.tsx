import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getTodaySyncedQueue, getDoctorForDisplay } from "@/app/actions/clinic";
import { getDoctorByUserId, getDoctorPatients } from "@/app/actions/doctorPortal";
import SecretaryClient from "./SecretaryClient";

export default async function SecretaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireAuth(locale);

  let doctorId: string | null = null;
  if (session.role === "secretary") {
    const user = await (await import("@/lib/prisma")).prisma.user.findUnique({ where: { id: session.userId } });
    doctorId = user?.linkedDoctorId ?? null;
  } else if (session.role === "doctor") {
    const doctor = await getDoctorByUserId(session.userId);
    doctorId = doctor?.id ?? null;
  } else {
    redirect(`/${locale}/admin`);
  }

  if (!doctorId) redirect(`/${locale}/login`);

  const [queue, doctor, patients] = await Promise.all([
    getTodaySyncedQueue(doctorId),
    getDoctorForDisplay(doctorId),
    getDoctorPatients(doctorId),
  ]);

  return (
    <DashboardLayout locale={locale} userName={session.name} role={session.role}>
      <SecretaryClient queue={queue as any} doctor={doctor} patients={patients} doctorId={doctorId} locale={locale} />
    </DashboardLayout>
  );
}
