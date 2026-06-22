import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iraq Clinic Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
