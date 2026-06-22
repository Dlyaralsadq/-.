import Link from "next/link";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { getPublicSpecialties, getListedDoctors } from "@/lib/publicDoctors";
import { GOVERNORATES, getSpecialtyIcon } from "@/lib/iraq";

export default async function PatientSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ specialty?: string; gov?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { specialty, gov, q } = await searchParams;
  const ar = locale === "ar";

  const [specialties, doctors] = await Promise.all([
    getPublicSpecialties(),
    getListedDoctors({ specialtyId: specialty, governorate: gov, query: q }),
  ]);

  const hasFilter = !!(specialty || gov || q);
  const otherLocale = ar ? "en" : "ar";

  return (
    <div className="min-h-screen bg-[#060912]" dir={ar ? "rtl" : "ltr"}>

      {/* ── ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-cyan-600/8 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-violet-600/5 blur-[100px] rounded-full" />
      </div>

      {/* ── top nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[#060912]/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-lg shadow-lg shadow-indigo-950/60">
            🏥
          </div>
          <span className="font-black text-white text-lg">ClinicPro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${otherLocale}/patient`}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:text-white/70 transition"
          >
            {ar ? "EN" : "AR"}
          </Link>
          <Link
            href={`/${locale}/login`}
            className="text-xs px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition"
          >
            {ar ? "دخول الأطباء" : "Doctor Login"}
          </Link>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16">

        {/* ── hero ── */}
        {!hasFilter && (
          <div className="pt-12 pb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-4 py-1.5 text-xs text-indigo-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {ar ? "أطباء نشطون الآن" : "Active doctors now"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {ar ? "ابحث عن طبيبك\nفي العراق" : "Find Your Doctor\nin Iraq"}
            </h1>
            <p className="mt-3 text-white/40 max-w-md mx-auto text-sm">
              {ar
                ? "تخصصات طبية من جميع المحافظات — احجز موعدك أونلاين أو تواصل مع السكرتير مباشرة"
                : "Medical specialties across all governorates — book online or contact the secretary directly"}
            </p>
          </div>
        )}

        {hasFilter && <div className="pt-6" />}

        {/* ── search bar ── */}
        <form method="GET" className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-4">

            {/* specialty */}
            <div className="relative flex-1">
              <label className="block text-[10px] text-white/30 mb-1.5 px-1">
                {ar ? "التخصص" : "Specialty"}
              </label>
              <div className="relative">
                <select
                  name="specialty"
                  defaultValue={specialty ?? ""}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#0c1121] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 pr-8"
                >
                  <option value="">{ar ? "جميع التخصصات" : "All specialties"}</option>
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {getSpecialtyIcon(s.id)} {ar ? s.nameAr : s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            {/* governorate */}
            <div className="relative flex-1">
              <label className="block text-[10px] text-white/30 mb-1.5 px-1">
                {ar ? "المحافظة" : "Governorate"}
              </label>
              <div className="relative">
                <select
                  name="gov"
                  defaultValue={gov ?? ""}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#0c1121] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 pr-8"
                >
                  <option value="">{ar ? "جميع المحافظات" : "All governorates"}</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {ar ? g.ar : g.en}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-white/30" />
              </div>
            </div>

            {/* search input */}
            <div className="relative flex-1">
              <label className="block text-[10px] text-white/30 mb-1.5 px-1">
                {ar ? "اسم الطبيب" : "Doctor name"}
              </label>
              <div className="relative">
                <input
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder={ar ? "ابحث..." : "Search..."}
                  className="w-full rounded-xl border border-white/10 bg-[#0c1121] ps-4 pe-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50"
                />
                <Search size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-white/25" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 hover:opacity-90 transition"
              >
                {ar ? "بحث" : "Search"}
              </button>
            </div>
          </div>
        </form>

        {/* ── specialty cards (when no filter) ── */}
        {!hasFilter && specialties.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-white/50 mb-4">
              {ar ? "تصفح حسب التخصص" : "Browse by specialty"}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {specialties.map((s) => (
                <Link
                  key={s.id}
                  href={`/${locale}/patient?specialty=${s.id}`}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/3 p-3 text-center transition hover:border-indigo-500/40 hover:bg-indigo-500/8"
                >
                  <span className="text-2xl">{getSpecialtyIcon(s.id)}</span>
                  <span className="text-[11px] text-white/60 group-hover:text-white/90 leading-tight">
                    {ar ? s.nameAr : s.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── results ── */}
        <section>
          {hasFilter && (
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">
                {doctors.length > 0
                  ? `${doctors.length} ${ar ? "طبيب متاح" : "doctors found"}`
                  : ar ? "لا توجد نتائج" : "No results"}
              </h2>
              <Link
                href={`/${locale}/patient`}
                className="text-xs text-white/30 hover:text-white/60 transition"
              >
                {ar ? "مسح الفلاتر" : "Clear filters"}
              </Link>
            </div>
          )}

          {!hasFilter && doctors.length > 0 && (
            <h2 className="text-sm font-semibold text-white/50 mb-4">
              {ar ? "أطباء متاحون" : "Available doctors"}
            </h2>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/${locale}/patient/doctor/${doctor.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-5 transition duration-200 hover:border-indigo-400/30 hover:bg-indigo-500/5"
              >
                <div className="flex items-start gap-4">
                  {/* avatar */}
                  <div className="shrink-0">
                    {doctor.logoUrl ? (
                      <img
                        src={doctor.logoUrl}
                        alt=""
                        className="h-14 w-14 rounded-2xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600/80 to-violet-700/80 text-2xl border border-white/5">
                        {getSpecialtyIcon(doctor.specialty.id ?? "")}
                      </div>
                    )}
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-indigo-200 transition">
                      {ar ? doctor.nameAr : doctor.name}
                    </h3>
                    <p className="text-xs text-indigo-400 mt-0.5">
                      {ar ? doctor.specialty.nameAr : doctor.specialty.name}
                    </p>
                    {doctor.experienceYears && (
                      <p className="text-xs text-white/30 mt-0.5">
                        {doctor.experienceYears} {ar ? "سنة خبرة" : "yrs exp"}
                      </p>
                    )}
                  </div>

                  {/* chevron */}
                  <span className="text-white/20 group-hover:text-indigo-400 transition text-lg mt-1">›</span>
                </div>

                {/* footer row */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                  {doctor.clinicAddress && (
                    <span className="flex items-center gap-1 text-xs text-white/40 truncate flex-1">
                      <MapPin size={11} className="shrink-0" />
                      {doctor.clinicAddress}
                    </span>
                  )}
                  {doctor.consultationFee != null && (
                    <span className="shrink-0 text-xs font-semibold text-emerald-400">
                      {doctor.consultationFee.toLocaleString()} {ar ? "د.ع" : "IQD"}
                    </span>
                  )}
                </div>

                {/* online booking badge */}
                <span className="absolute top-3 end-3 text-[10px] rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-400">
                  {ar ? "حجز أونلاين" : "Online booking"}
                </span>
              </Link>
            ))}
          </div>

          {hasFilter && doctors.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/3 py-16 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-white/40 text-sm">
                {ar ? "لا يوجد أطباء متاحون بهذه المعايير" : "No doctors found with these filters"}
              </p>
              <Link
                href={`/${locale}/patient`}
                className="mt-4 text-xs text-indigo-400 hover:underline"
              >
                {ar ? "عرض الكل" : "Show all"}
              </Link>
            </div>
          )}

          {!hasFilter && doctors.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/3 py-16 text-center">
              <span className="text-5xl mb-4">🏥</span>
              <p className="text-white/40 text-sm">
                {ar ? "لا يوجد أطباء مسجلون حالياً" : "No registered doctors yet"}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ── install hint bottom bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-white/5 bg-[#060912]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-base">🏥</div>
          <div>
            <p className="text-xs font-semibold text-white">{ar ? "ثبّت التطبيق" : "Install App"}</p>
            <p className="text-[10px] text-white/30">{ar ? "أضفه لشاشة الرئيسية" : "Add to home screen"}</p>
          </div>
        </div>
        <button
          id="pwa-install-btn"
          className="text-xs px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition hidden"
        >
          {ar ? "تثبيت" : "Install"}
        </button>
        <script dangerouslySetInnerHTML={{ __html: `
          let deferredPrompt;
          window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault(); deferredPrompt = e;
            document.getElementById('pwa-install-btn')?.classList.remove('hidden');
          });
          document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
            deferredPrompt?.prompt();
            deferredPrompt?.userChoice.then(() => { deferredPrompt = null; });
          });
        ` }} />
      </div>

    </div>
  );
}
