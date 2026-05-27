import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iraq Medical Clinic SaaS",
  description: "Bilingual SaaS foundation for medical clinic management in Iraq."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
