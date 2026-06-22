import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Banknote, Phone, Calendar, ArrowRight, Star } from "lucide-react";
import { getPublicDoctorById } from "@/lib/publicDoctors";
import { GOVERNORATES, getSpecialtyIcon } from "@/lib/iraq";
import { prisma } from "@/lib/prisma";

const DAYS: Record<string, { ar: string; en: string }> = {
  "sat-thu": { ar: "السبت — الخميس", en: "Sat – Thu" },
  "sun-thu": { ar: "الأحد — الخميس", en: "Sun – Thu" },
  "sat-wed": { ar: "السبت — الأربعاء", en: "Sat – Wed" },
  "mon-fri": { ar: "الاثنين — الجمعة", en: "Mon – Fri" },
};

export default async function PatientDoctorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const ar = locale === "ar";
  const doctor = await getPublicDoctorById(id);
  if (!doctor) notFound();

  // Fetch secretary info
  const secretary = await prisma.user.findFirst({
    where: { linkedDoctorId: doctor.id, role: "secretary", isActive: true },
    select: { name: true },
  });

  const doctorUser = doctor.userId
    ? await prisma.user.findUnique({
        where: { id: doctor.userId },
        select: { name: true },
      })
    : null;

  const govLabel = doctor.clinicAddress
    ? GOVERNORATES.find(
        (g) => doctor.clinicAddress?.toLowerCase().includes(g.en.toLowerCase()) ||
               doctor.clinicAddress?.includes(g.ar)
      )
    : null;

  const hours =
    doctor.workingHoursStart && doctor.workingHoursEnd
      ? `${doctor.workingHoursStart} – ${doctor.workingHoursEnd}`
      : null;

  const mapUrl =
    doctor.clinicLat && doctor.clinicLng
      ? `https://www.google.com/maps?q=${doctor.clinicLat},${doctor.clinicLng}`
      : null;

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
          href={`/${locale}/patient`}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition"
        >
          <ArrowRight size={16} className={ar ? "" : "rotate-180"} />
          {ar ? "العودة للبحث" : "Back to search"}
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-lg">🏥</div>
      </nav>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 pb-32">

        {/* Doctor header */}
        <div className="mb-5 flex items-start gap-4">
          {doctor.logoUrl ? (
            <img
              src={doctor.logoUrl}
              alt=""
              className="h-20 w-20 rounded-2xl object-cover border border-white/10 shrink-0"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600/80 to-violet-700/80 text-3xl border border-white/5">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white leading-tight">
              {ar ? doctor.nameAr : doctor.name}
            </h1>
            <p className="mt-1 text-sm text-indigo-400">
              {ar ? doctor.specialty.nameAr : doctor.specialty.name}
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {doctor.experienceYears && (
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Star size={10} className="text-amber-400" />
                  {doctor.experienceYears} {ar ? "سنة خبرة" : "yrs exp"}
                </span>
              )}
              {govLabel && (
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <MapPin size={10} />
                  {ar ? govLabel.ar : govLabel.en}
                </span>
              )}
              <span className="text-[10px] rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-400">
                {ar ? "حجز أونلاين" : "Online booking"}
              </span>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid gap-3 mb-5">

          {doctor.clinicAddress && (
            <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-[11px] text-white/30 mb-0.5">{ar ? "عنوان العيادة" : "Clinic address"}</p>
                <p className="text-sm text-white">{doctor.clinicAddress}</p>
                {mapUrl && (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-indigo-400 hover:underline mt-1 inline-block">
                    {ar ? "عرض على الخريطة ↗" : "View on map ↗"}
                  </a>
                )}
              </div>
            </div>
          )}

          {(hours || DAYS[doctor.workingDays ?? ""]) && (
            <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-[11px] text-white/30 mb-0.5">{ar ? "ساعات العمل" : "Working hours"}</p>
                {hours && <p className="text-sm text-white">{hours}</p>}
                {DAYS[doctor.workingDays ?? ""] && (
                  <p className="text-xs text-white/40 mt-0.5">
                    {ar ? DAYS[doctor.workingDays!].ar : DAYS[doctor.workingDays!].en}
                  </p>
                )}
              </div>
            </div>
          )}

          {doctor.consultationFee != null && (
            <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Banknote size={16} />
              </div>
              <div>
                <p className="text-[11px] text-white/30 mb-0.5">{ar ? "سعر الكشفية" : "Consultation fee"}</p>
                <p className="text-lg font-black text-emerald-400">
                  {doctor.consultationFee.toLocaleString()} <span className="text-sm font-normal text-emerald-500/70">{ar ? "د.ع" : "IQD"}</span>
                </p>
              </div>
            </div>
          )}

          {/* Secretary contact */}
          {doctor.phone && (
            <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <Phone size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-cyan-400/70 mb-0.5">
                  {secretary
                    ? (ar ? `للتواصل مع السكرتير — ${secretary.name}` : `Contact Secretary — ${secretary.name}`)
                    : (ar ? "للتواصل مع العيادة" : "Contact the clinic")}
                </p>
                <p className="text-sm font-bold text-white">{doctor.phone}</p>
                <a
                  href={`tel:${doctor.phone}`}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition"
                >
                  <Phone size={12} />
                  {ar ? "اتصال الآن" : "Call now"}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        {(doctor.bio || doctor.bioAr) && (
          <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-4 mb-5">
            <p className="text-[11px] text-white/30 mb-2">{ar ? "نبذة عن الطبيب" : "About the doctor"}</p>
            <p className="text-sm text-white/60 leading-relaxed">
              {ar ? (doctor.bioAr ?? doctor.bio) : (doctor.bio ?? doctor.bioAr)}
            </p>
          </div>
        )}

      </div>

      {/* ── sticky booking CTA ── */}
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-white/8 bg-[#060912]/95 backdrop-blur-md p-4">
        <div className="mx-auto max-w-2xl grid grid-cols-2 gap-3">
          {doctor.phone && (
            <a
              href={`tel:${doctor.phone}`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 py-3.5 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              <Phone size={15} />
              {ar ? "حجز بالهاتف" : "Call to book"}
            </a>
          )}
          <Link
            href={`/${locale}/patient/book/${doctor.id}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 hover:opacity-90 transition"
          >
            <Calendar size={15} />
            {ar ? "حجز أونلاين" : "Book online"}
          </Link>
        </div>
      </div>

    </div>
  );
}
