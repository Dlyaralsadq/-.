import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session) redirect(`/${locale}/login`);
  if (session.role === "doctor") redirect(`/${locale}/doctor`);
  redirect(`/${locale}/admin`);
}
