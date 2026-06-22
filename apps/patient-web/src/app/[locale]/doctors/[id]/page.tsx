import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getDoctorById } from "@/lib/doctors";

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });
  const ar = locale === "ar";
  const doctor = await getDoctorById(id);

  if (!doctor) notFound();

  const hours =
    doctor.workingHoursStart && doctor.workingHoursEnd
      ? `${doctor.workingHoursStart} - ${doctor.workingHoursEnd}`
      : null;

  const mapUrl =
    doctor.clinicLat && doctor.clinicLng
      ? `https://www.google.com/maps?q=${doctor.clinicLat},${doctor.clinicLng}`
      : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/${locale}`}
        className="text-sm text-indigo-300 hover:underline"
      >
        {t("doctor.back")}
      </Link>

      <article className="card mt-4 p-6">
        <h1 className="text-2xl font-bold">
          {ar ? doctor.nameAr : doctor.name}
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          {t("doctor.specialty")}: {ar ? doctor.specialty.nameAr : doctor.specialty.name}
        </p>

        {doctor.consultationFee != null && (
          <p className="mt-4">
            <strong>{t("doctor.fee")}:</strong>{" "}
            {doctor.consultationFee.toLocaleString()} {t("doctor.iqd")}
          </p>
        )}

        {doctor.clinicAddress && (
          <p className="mt-3">
            <strong>{t("doctor.address")}:</strong> {doctor.clinicAddress}
          </p>
        )}

        {hours && (
          <p className="mt-3">
            <strong>{t("doctor.hours")}:</strong> {hours}
          </p>
        )}

        {doctor.bio && (
          <p className="mt-4 text-[var(--muted)]">
            {ar ? doctor.bioAr ?? doctor.bio : doctor.bio}
          </p>
        )}

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-6 inline-block"
          >
            {t("doctor.viewMap")}
          </a>
        )}

        <p className="mt-6 text-sm text-[var(--muted)]">{t("search.bookSoon")}</p>
      </article>
    </main>
  );
}
