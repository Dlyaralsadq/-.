import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublicDoctorById } from "@/lib/publicDoctors";
import { getSpecialtyIcon } from "@/lib/iraq";
import BookingForm from "./BookingForm";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string; doctorId: string }>;
}) {
  const { locale, doctorId } = await params;
  const ar = locale === "ar";
  const doctor = await getPublicDoctorById(doctorId);
  if (!doctor) notFound();

  const icon = getSpecialtyIcon(doctor.specialtyId ?? "");

  return (
    <div className="min-h-screen bg-[#060912]" dir={ar ? "rtl" : "ltr"}>

      {/* ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      {/* nav */}
      <nav className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[#060912]/80 backdrop-blur-md sticky top-0">
        <Link
          href={`/${locale}/patient/doctor/${doctorId}`}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition"
        >
          <ArrowRight size={16} className={ar ? "" : "rotate-180"} />
          {ar ? "العودة لبيانات الطبيب" : "Back to doctor"}
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-lg">🏥</div>
      </nav>

      <div className="relative z-10 mx-auto max-w-lg px-4 py-8">

        <div className="mb-7 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600/80 to-violet-700/80 text-3xl mb-4 border border-white/5">
            {icon}
          </div>
          <h1 className="text-xl font-black text-white">
            {ar ? "حجز موعد أونلاين" : "Online Appointment Booking"}
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {ar ? "أدخل بياناتك لحجز موعدك مع الطبيب" : "Fill in your details to book an appointment"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <BookingForm
            doctorId={doctorId}
            doctorName={doctor.name}
            doctorNameAr={doctor.nameAr}
            specialtyAr={doctor.specialty.nameAr}
            specialtyEn={doctor.specialty.name}
            locale={locale}
          />
        </div>

      </div>
    </div>
  );
}
