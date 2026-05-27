import {
  Activity,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Database,
  Globe2,
  Languages,
  LockKeyhole,
  Stethoscope,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAlternateLocale,
  getDictionary,
  getDirection,
  isLocale,
  locales,
  type Locale
} from "@/lib/i18n";
import {
  getSpecialtyCountLabel,
  medicalSpecialties,
  specialtyCategoryLabels
} from "@/lib/medical-specialties";
import { iraqReadinessItems, productModules, userRoles } from "@/lib/saas-model";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const moduleIcons = [
  Building2,
  UsersRound,
  ClipboardList,
  CalendarDays,
  Stethoscope,
  CreditCard,
  Activity,
  Globe2
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : "ar";
  const t = getDictionary(locale);

  return {
    title: t.hero.title,
    description: t.hero.description
  };
}

export default async function LocaleHome({ params }: PageProps) {
  const { locale: requestedLocale } = await params;

  if (!isLocale(requestedLocale)) {
    notFound();
  }

  const locale: Locale = requestedLocale;
  const direction = getDirection(locale);
  const t = getDictionary(locale);
  const alternateLocale = getAlternateLocale(locale);
  const featuredSpecialties = medicalSpecialties.slice(0, 12);

  return (
    <main dir={direction} lang={locale} className="min-h-screen overflow-hidden">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-lg font-black text-white shadow-lg shadow-teal-600/25">
            IQ
          </span>
          <span>
            <span className="block text-sm font-bold text-slate-950">
              Iraq Clinic SaaS
            </span>
            <span className="block text-xs text-slate-500">
              {t.localeLabel}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <a href="#product">{t.nav.product}</a>
          <a href="#modules">{t.nav.modules}</a>
          <a href="#specialties">{t.nav.specialties}</a>
          <a href="#roadmap">{t.nav.roadmap}</a>
        </nav>

        <Link
          href={`/${alternateLocale}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <Languages className="h-4 w-4" />
          {t.switchLocale}
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1fr_0.9fr] lg:pt-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800">
            <CheckCircle2 className="h-4 w-4" />
            {t.hero.eyebrow}
          </div>
          <h1 className="mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {t.hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#modules"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-950/20"
            >
              {t.hero.primaryAction}
            </a>
            <a
              href="#specialties"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm"
            >
              {t.hero.secondaryAction}
            </a>
          </div>

          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-7 text-amber-900">
            {t.hero.noPortal}
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {t.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm"
              >
                <dt className="text-sm font-semibold text-slate-500">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-3xl font-black text-slate-950">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-teal-300/25 to-blue-400/20 blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-2xl shadow-slate-900/10">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-teal-200">{t.product.title}</p>
                  <h2 className="mt-1 text-2xl font-black">Dashboard</h2>
                </div>
                <Database className="h-7 w-7 text-teal-300" />
              </div>

              <div className="mt-5 grid gap-3">
                {productModules.slice(0, 5).map((module, index) => {
                  const Icon = moduleIcons[index] ?? Activity;

                  return (
                    <div
                      key={module.key}
                      className="flex items-start gap-3 rounded-2xl bg-white/10 p-4"
                    >
                      <span className="rounded-xl bg-teal-400/20 p-2 text-teal-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold">
                          {module.name[locale]}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-300">
                          {module.summary[locale]}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-3xl font-black text-slate-950">
              {t.product.title}
            </h2>
            <p className="mt-4 leading-8 text-slate-600">
              {t.product.description}
            </p>
          </article>

          <div className="grid gap-4 sm:grid-cols-3">
            {iraqReadinessItems.map((item) => (
              <article
                key={item.en}
                className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm"
              >
                <CheckCircle2 className="h-6 w-6 text-teal-600" />
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-700">
                  {item[locale]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="mx-auto w-full max-w-7xl px-6 py-12">
        <SectionHeading title={t.modules.title} description={t.modules.description} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {productModules.map((module, index) => {
            const Icon = moduleIcons[index] ?? Activity;

            return (
              <article
                key={module.key}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                    {module.mvp ? "MVP" : "Later"}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-black text-slate-950">
                  {module.name[locale]}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {module.summary[locale]}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="specialties" className="mx-auto w-full max-w-7xl px-6 py-12">
        <SectionHeading
          title={t.specialties.title}
          description={`${t.specialties.description} ${getSpecialtyCountLabel(locale)}.`}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredSpecialties.map((specialty) => (
            <article
              key={specialty.slug}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
                {specialtyCategoryLabels[specialty.category][locale]}
              </p>
              <h3 className="mt-3 text-xl font-black text-slate-950">
                {specialty.name[locale]}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {specialty.workflowFocus[locale]}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {specialty.templateFields.map((field) => (
                  <span
                    key={field.en}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {field[locale]}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-teal-200">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-3xl font-black">{t.compliance.title}</h2>
              <p className="mt-4 leading-8 text-slate-300">
                {t.compliance.description}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              {userRoles.map((role) => (
                <div key={role.key} className="rounded-2xl bg-white/10 p-4">
                  <h3 className="text-sm font-bold text-white">
                    {role.name[locale]}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-300">
                    {role.description[locale]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" className="mx-auto w-full max-w-7xl px-6 py-12 pb-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading title={t.roadmap.title} description="" />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {t.roadmap.items.map((item, index) => (
              <li
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-black text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-700">
                  {item}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl font-black tracking-tight text-slate-950">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 leading-8 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
