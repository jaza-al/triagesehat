import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TriageSehat — Skrining Awal Gejala & Edukasi Kesehatan",
  description:
    "Platform skrining awal gejala dan edukasi kesehatan berbasis AI untuk IT RUSH Web Development 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}