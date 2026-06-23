import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getPublicSpecialties, getListedDoctors } from "@/lib/publicDoctors";
import { IRAQ_GOVERNORATES, getSpecialtyIcon, inferGovFromAddress } from "@/lib/iraq";
import MapWrapper from "./MapWrapper";
import type { DoctorPin } from "./PatientMapView";

export default async function PatientPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ specialty?: string; gov?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { specialty, gov, q } = await searchParams;
  const ar = locale === "ar";
  const otherLocale = ar ? "en" : "ar";

  const [specialties, rawDoctors] = await Promise.all([
    getPublicSpecialties(),
    getListedDoctors({ specialtyId: specialty, governorate: gov, query: q }),
  ]);

  // Build doctor pins — infer location from address if lat/lng missing
  const doctors: DoctorPin[] = rawDoctors.map((doc) => {
    const gov = inferGovFromAddress(doc.clinicAddress ?? "");
    const fallbackLat = gov?.lat ?? 33.2;
    const fallbackLng = gov?.lng ?? 44.0;
    return {
      id: doc.id,
      nameAr: doc.nameAr,
      name: doc.name,
      specialtyId: doc.specialtyId,
      specialtyAr: doc.specialty.nameAr,
      specialtyEn: doc.specialty.name,
      lat: doc.clinicLat ?? null,
      lng: doc.clinicLng ?? null,
      govLat: fallbackLat,
      govLng: fallbackLng,
      clinicAddress: doc.clinicAddress,
      phone: doc.phone,
      consultationFee: doc.consultationFee,
      workingHoursStart: doc.workingHoursStart,
      workingHoursEnd: doc.workingHoursEnd,
      specialtyIcon: getSpecialtyIcon(doc.specialtyId),
    };
  });

  return (
    <div
      className="flex flex-col h-screen bg-[#060912] overflow-hidden"
      dir={ar ? "rtl" : "ltr"}
    >
      {/* ── Top nav ── */}
      <nav className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#060912]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-base shadow-lg shadow-indigo-950/60">
            🏥
          </div>
          <span className="font-black text-white text-base">ClinicPro</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${otherLocale}/patient`}
            className="text-xs px-2.5 py-1.5 rounded-full border border-white/10 text-white/40 hover:text-white/70 transition"
          >
            {ar ? "EN" : "AR"}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="text-xs px-2.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition"
          >
            {ar ? "دخول الأطباء" : "Doctor login"}
          </Link>
        </div>
      </nav>

      {/* ── Filters ── */}
      <form
        method="GET"
        className="shrink-0 flex items-center gap-2 px-3 py-2.5 bg-[#060912]/80 border-b border-white/5 backdrop-blur-md z-10 overflow-x-auto"
      >
        {/* Specialty */}
        <div className="relative shrink-0">
          <select
            name="specialty"
            defaultValue={specialty ?? ""}
            className="h-9 appearance-none rounded-xl border border-white/10 bg-white/5 ps-3 pe-7 text-xs text-white focus:outline-none focus:border-indigo-500/50 max-w-[160px]"
          >
            <option value="">{ar ? "كل التخصصات" : "All specialties"}</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {getSpecialtyIcon(s.id)} {ar ? s.nameAr : s.name}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-white/30" />
        </div>

        {/* Governorate */}
        <div className="relative shrink-0">
          <select
            name="gov"
            defaultValue={gov ?? ""}
            className="h-9 appearance-none rounded-xl border border-white/10 bg-white/5 ps-3 pe-7 text-xs text-white focus:outline-none focus:border-indigo-500/50 max-w-[140px]"
          >
            <option value="">{ar ? "كل المحافظات" : "All governorates"}</option>
            {IRAQ_GOVERNORATES.map((g) => (
              <option key={g.id} value={g.id}>
                {ar ? g.ar : g.en}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-white/30" />
        </div>

        {/* Search */}
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder={ar ? "اسم الطبيب..." : "Doctor name..."}
          className="h-9 flex-1 min-w-[100px] rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50"
        />

        <button
          type="submit"
          className="shrink-0 h-9 px-4 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 transition"
        >
          {ar ? "بحث" : "Search"}
        </button>
      </form>

      {/* ── Map — fills remaining height ── */}
      <div className="flex-1 relative min-h-0">
        <MapWrapper doctors={doctors} locale={locale} />
      </div>
    </div>
  );
}
