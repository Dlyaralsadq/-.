import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="max-w-xl rounded-3xl border border-slate-200 bg-white/85 p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-700">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-950">
          الصفحة غير موجودة
        </h1>
        <p className="mt-3 text-slate-600">
          الرابط المطلوب غير متوفر حالياً. يمكنك العودة إلى الصفحة الرئيسية.
        </p>
        <Link
          href="/ar"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          العودة للرئيسية
        </Link>
      </section>
    </main>
  );
}
