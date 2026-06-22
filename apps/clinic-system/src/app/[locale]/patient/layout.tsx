import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "ابحث عن طبيبك — ClinicPro" : "Find Your Doctor — ClinicPro",
    description: ar
      ? "ابحث عن طبيب في العراق حسب التخصص والموقع واحجز موعدك أونلاين"
      : "Find a doctor in Iraq by specialty and location, book your appointment online",
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "ClinicPro",
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  };
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#060912" />
      <script
        dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
        }}
      />
      {children}
    </>
  );
}
