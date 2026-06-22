import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Banknote, ArrowRight, CalendarClock } from "lucide-react";
import { getPublicDoctorById } from "@/lib/publicDoctors";

export default async function PatientDoctorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const ar = locale === "ar";
  const doctor = await getPublicDoctorById(id);
  if (!doctor) notFound();

  const hours =
    doctor.workingHoursStart && doctor.workingHoursEnd
      ? `${doctor.workingHoursStart} – ${doctor.workingHoursEnd}`
      : null;

  const mapUrl =
    doctor.clinicLat && doctor.clinicLng
      ? `https://www.google.com/maps?q=${doctor.clinicLat},${doctor.clinicLng}`
      : null;

  const workingDaysMap: Record<string, { ar: string; en: string }> = {
    "sat-thu": { ar: "السبت — الخميس", en: "Sat – Thu" },
    "sun-thu": { ar: "الأحد — الخميس", en: "Sun – Thu" },
    "sat-wed": { ar: "السبت — الأربعاء", en: "Sat – Wed" },
    "mon-fri": { ar: "الاثنين — الجمعة", en: "Mon – Fri" },
  };
  const daysLabel = doctor.workingDays
    ? (workingDaysMap[doctor.workingDays]?.[ar ? "ar" : "en"] ?? doctor.workingDays)
    : null;

  return (
    <div
      className="min-h-screen bg-[#060912]"
      dir={ar ? "rtl" : "ltr"}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-600/8 blur-[120px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8">
        {/* Back */}
        <Link
          href={`/${locale}/patient`}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition mb-6"
        >
          <ArrowRight size={15} className={ar ? "" : "rotate-180"} />
          {ar ? "العودة للبحث" : "Back to search"}
        </Link>

        {/* Doctor card */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-6 mb-4">
          <div className="flex items-start gap-4 mb-6">
            {doctor.logoUrl ? (
              <img
                src={doctor.logoUrl}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover border border-white/10 shrink-0"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-700 text-3xl">
                🩺
              </div>
            )}
            <div>
              <h1 className="text-xl font-black text-white">
                {ar ? doctor.nameAr : doctor.name}
              </h1>
              <p className="mt-1 text-sm text-cyan-400">
                {ar ? doctor.specialty.nameAr : doctor.specialty.name}
              </p>
              {doctor.experienceYears && (
                <p className="mt-1 text-xs text-white/40">
                  {doctor.experienceYears} {ar ? "سنة خبرة" : "years experience"}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            {doctor.clinicAddress && (
              <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <MapPin size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-white/40 mb-0.5">{ar ? "العنوان" : "Address"}</p>
                  <p className="text-sm text-white">{doctor.clinicAddress}</p>
                </div>
              </div>
            )}

            {hours && (
              <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <Clock size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-white/40 mb-0.5">
                    {ar ? "ساعات العمل" : "Working hours"}
                  </p>
                  <p className="text-sm text-white">{hours}</p>
                  {daysLabel && (
                    <p className="text-xs text-white/40 mt-0.5">{daysLabel}</p>
                  )}
                </div>
              </div>
            )}

            {doctor.consultationFee != null && (
              <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <Banknote size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-white/40 mb-0.5">
                    {ar ? "سعر الكشفية" : "Consultation fee"}
                  </p>
                  <p className="text-sm font-semibold text-emerald-400">
                    {doctor.consultationFee.toLocaleString()} {ar ? "د.ع" : "IQD"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {(doctor.bio || doctor.bioAr) && (
            <p className="mt-4 text-sm text-white/50 leading-relaxed border-t border-white/8 pt-4">
              {ar ? doctor.bioAr ?? doctor.bio : doctor.bio ?? doctor.bioAr ?? ""}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/4 py-3 text-sm font-semibold text-white/70 hover:text-white hover:border-white/20 transition"
            >
              <MapPin size={16} />
              {ar ? "عرض على الخريطة" : "View on map"}
            </a>
          )}
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/8 py-3 text-sm font-semibold text-cyan-300">
            <CalendarClock size={16} />
            {ar ? "الحجز الإلكتروني قريباً" : "Online booking coming soon"}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-white/20">
          {ar
            ? "لحجز موعد الآن، يرجى التواصل مع العيادة مباشرة"
            : "To book now, please contact the clinic directly"}
        </p>
      </div>
    </div>
  );
}
