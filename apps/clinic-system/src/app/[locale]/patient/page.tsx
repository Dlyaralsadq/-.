import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { getPublicSpecialties, getListedDoctors } from "@/lib/publicDoctors";

export default async function PatientSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ specialty?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { specialty, q } = await searchParams;
  const ar = locale === "ar";

  const [specialties, doctors] = await Promise.all([
    getPublicSpecialties(),
    getListedDoctors({ specialtyId: specialty, query: q }),
  ]);

  return (
    <div
      className="min-h-screen bg-[#060912]"
      dir={ar ? "rtl" : "ltr"}
    >
      {/* ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-600/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-teal-600/6 blur-[80px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">
              {ar ? "ابحث عن طبيب" : "Find a Doctor"}
            </h1>
            <p className="mt-1 text-sm text-white/40">
              {ar
                ? "تخصصات طبية في العراق — اختر طبيبك واحجز موعدك"
                : "Medical specialties across Iraq — choose your doctor"}
            </p>
          </div>
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2 text-sm text-white/50 hover:text-white/80 transition"
          >
            {ar ? <ArrowRight size={16} /> : null}
            {ar ? "الرئيسية" : "Home"}
            {!ar ? <ArrowRight size={16} /> : null}
          </Link>
        </div>

        {/* Search form */}
        <form
          className="mb-8 grid gap-3 rounded-2xl border border-white/8 bg-white/4 p-5 sm:grid-cols-3"
          method="GET"
        >
          <div>
            <label className="mb-1.5 block text-xs text-white/40">
              {ar ? "التخصص" : "Specialty"}
            </label>
            <select
              name="specialty"
              defaultValue={specialty ?? ""}
              className="w-full rounded-xl border border-white/10 bg-[#0c1121] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="">
                {ar ? "جميع التخصصات" : "All specialties"}
              </option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {ar ? s.nameAr : s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-white/40">
              {ar ? "ابحث باسم الطبيب" : "Search by doctor name"}
            </label>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder={ar ? "اسم الطبيب أو العنوان..." : "Doctor name or address..."}
              className="w-full rounded-xl border border-white/10 bg-[#0c1121] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 hover:opacity-90 transition"
            >
              <Search size={16} />
              {ar ? "بحث" : "Search"}
            </button>
          </div>
        </form>

        {/* Results */}
        <div>
          <p className="mb-4 text-sm text-white/40">
            {doctors.length > 0
              ? `${doctors.length} ${ar ? "طبيب متاح" : "doctors available"}`
              : ar
              ? "لا توجد نتائج مطابقة"
              : "No matching results"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/${locale}/patient/doctor/${doctor.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/4 p-5 transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
              >
                <div className="flex items-start gap-3">
                  {doctor.logoUrl ? (
                    <img
                      src={doctor.logoUrl}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover border border-white/10"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-teal-700 text-xl">
                      🩺
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">
                      {ar ? doctor.nameAr : doctor.name}
                    </h3>
                    <p className="text-xs text-cyan-400 mt-0.5">
                      {ar ? doctor.specialty.nameAr : doctor.specialty.name}
                    </p>
                  </div>
                </div>

                {doctor.clinicAddress && (
                  <p className="text-xs text-white/50 leading-relaxed">
                    📍 {doctor.clinicAddress}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {doctor.consultationFee != null ? (
                    <span className="text-xs text-white/60">
                      {ar ? "الكشفية:" : "Fee:"}{" "}
                      <span className="text-emerald-400 font-semibold">
                        {doctor.consultationFee.toLocaleString()}{" "}
                        {ar ? "د.ع" : "IQD"}
                      </span>
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-white/30 group-hover:text-cyan-400 transition">
                    {ar ? "عرض التفاصيل ←" : "View details →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {doctors.length === 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/4 p-12 text-center text-white/30">
              <p className="text-4xl mb-3">🔍</p>
              <p>{ar ? "لا يوجد أطباء متاحون حالياً" : "No doctors available at the moment"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
