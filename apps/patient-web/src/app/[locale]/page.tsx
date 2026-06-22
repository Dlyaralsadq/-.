import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Search } from "lucide-react";
import { getListedDoctors, getSpecialties } from "@/lib/doctors";

export default async function PatientHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ specialty?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { specialty, q } = await searchParams;
  const t = await getTranslations({ locale });
  const ar = locale === "ar";

  const [specialties, doctors] = await Promise.all([
    getSpecialties(),
    getListedDoctors({ specialtyId: specialty, query: q }),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <p className="text-sm text-[var(--muted)]">{t("footer.platform")}</p>
        <h1 className="mt-2 text-3xl font-bold">{t("hero.title")}</h1>
        <p className="mt-2 text-[var(--muted)]">{t("hero.subtitle")}</p>
      </header>

      <form className="card mb-8 grid gap-4 p-4 md:grid-cols-3" method="GET">
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">
            {t("search.specialty")}
          </label>
          <select name="specialty" className="input" defaultValue={specialty ?? ""}>
            <option value="">{t("search.allSpecialties")}</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {ar ? s.nameAr : s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">
            {t("search.query")}
          </label>
          <input
            name="q"
            className="input"
            defaultValue={q ?? ""}
            placeholder={t("search.query")}
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn flex w-full items-center justify-center gap-2">
            <Search size={18} />
            {t("search.results")}
          </button>
        </div>
      </form>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t("search.results")}</h2>
        {doctors.length === 0 ? (
          <div className="card p-6 text-[var(--muted)]">{t("search.empty")}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/${locale}/doctors/${doctor.id}`}
                className="card block p-5 transition hover:border-indigo-400/40"
              >
                <h3 className="text-lg font-semibold">
                  {ar ? doctor.nameAr : doctor.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {ar ? doctor.specialty.nameAr : doctor.specialty.name}
                </p>
                {doctor.clinicAddress && (
                  <p className="mt-2 text-sm">{doctor.clinicAddress}</p>
                )}
                {doctor.consultationFee != null && (
                  <p className="mt-2 text-sm text-indigo-300">
                    {t("doctor.fee")}: {doctor.consultationFee.toLocaleString()} {t("doctor.iqd")}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <span>{t("footer.platform")}</span>
        <a
          href={process.env.CLINIC_APP_URL ?? "http://localhost:3000"}
          className="text-indigo-300 hover:underline"
        >
          {t("footer.clinicSystem")}
        </a>
      </footer>
    </main>
  );
}
