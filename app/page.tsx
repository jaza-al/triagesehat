"use client";

import { useEffect, useState } from "react";
import SymptomForm from "@/app/components/SymptomForm";
import ResultCard from "@/app/components/ResultCard";
import HistoryPanel from "@/app/components/HistoryPanel";
import type { ScreeningInput, ScreeningResult } from "@/lib/types";
import {
  addHistory,
  clearHistory,
  loadHistory,
  type HistoryEntry,
} from "@/lib/history";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHistory(loadHistory());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function handleSubmit(input: ScreeningInput) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = (await res.json().catch(() => ({}))) as Partial<ScreeningResult> & {
        error?: string;
      };
      if (!res.ok) {
        throw new Error(json.error ?? "Terjadi kesalahan. Silakan coba lagi.");
      }
      const data = json as ScreeningResult;
      setResult(data);
      addHistory({
        createdAt: data.createdAt,
        category: data.category,
        urgency: data.urgency,
      });
      setHistory(loadHistory());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghubungi layanan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50/50 text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-emerald-500 text-lg font-extrabold text-white shadow-xs">
              +
            </div>
            <div>
              <p className="text-lg font-bold leading-tight tracking-tight text-slate-900">
                Triage<span className="text-emerald-600">Sehat</span>
              </p>
              <p className="text-xs text-slate-500">
                Skrining Cepat, Penanganan Tepat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 sm:inline-block">
              IT RUSH 2026
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              AI Skrining Awal
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        {/* Hero Section */}
        <section className="mb-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 text-center shadow-xs sm:p-8">
          <span className="inline-block rounded-full bg-gradient-to-r from-sky-100 to-emerald-100 px-3.5 py-1 text-xs font-semibold text-slate-800">
            Skrining Awal Gejala Berbasis AI · Bukan Pengganti Diagnosis Medis
          </span>
          <h1 className="mx-auto mt-3 max-w-3xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Cek Tingkat Urgensi Gejala Anda dalam Hitungan Detik
          </h1>
          <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Pilih contoh kasus cepat atau isi keluhan Anda untuk mendapatkan estimasi tingkat urgensi awal, panduan tindakan mandiri, serta tanda bahaya sebelum ke fasilitas kesehatan.
          </p>

          {/* Ringkasan Alur 3 Langkah */}
          <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
              <p className="text-xs font-bold text-sky-700">1. Input Gejala</p>
              <p className="mt-0.5 text-xs text-slate-600">
                Pilih skenario cepat atau isi gejala, durasi, dan skala keparahan.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
              <p className="text-xs font-bold text-emerald-700">2. Analisis Urgensi</p>
              <p className="mt-0.5 text-xs text-slate-600">
                Evaluasi tingkat urgensi awal &amp; deteksi tanda darurat secara instan.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
              <p className="text-xs font-bold text-teal-700">3. Riwayat Lokal</p>
              <p className="mt-0.5 text-xs text-slate-600">
                Hasil tersimpan otomatis di browser Anda untuk ditinjau kembali.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer Banner */}
        <div
          role="note"
          className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm leading-relaxed text-amber-950 shadow-xs"
        >
          <strong>Disclaimer:</strong> TriageSehat hanya menyediakan informasi skrining awal dan edukasi kesehatan, serta{" "}
          <strong>bukan pengganti diagnosis, pemeriksaan fisik, atau saran medis profesional</strong>. Jika mengalami kondisi darurat (seperti nyeri dada berat, sesak napas hebat, atau pingsan), segera hubungi{" "}
          <strong>112</strong> / <strong>118/119</strong> atau kunjungi IGD terdekat.
        </div>

        {/* Main Workspace */}
        <div className="grid items-start gap-8 lg:grid-cols-5">
          <section className="space-y-6 lg:col-span-2">
            <SymptomForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                {error}
              </p>
            )}
            <HistoryPanel
              entries={history}
              onClear={() => {
                clearHistory();
                setHistory([]);
              }}
            />
          </section>

          <section className="lg:col-span-3">
            {result ? (
              <div className="space-y-4">
                <ResultCard result={result} />
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-100"
                >
                  Skrining baru
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-lg font-bold text-teal-700">
                    AI
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-800">
                    Belum ada hasil skrining
                  </p>
                  <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
                    Isi formulir gejala di sebelah kiri atau klik salah satu tombol contoh kasus cepat untuk melihat estimasi tingkat urgensi, langkah awal, dan catatan kewaspadaan.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3">
                    <p className="text-xs font-semibold text-emerald-800">Ringan</p>
                    <p className="mt-0.5 text-[11px] text-emerald-700">
                      Pemantauan mandiri &amp; perawatan dasar.
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3">
                    <p className="text-xs font-semibold text-amber-800">Sedang / Perlu Periksa</p>
                    <p className="mt-0.5 text-[11px] text-amber-700">
                      Jadwalkan konsultasi dokter / fasilitas kesehatan.
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-200/80 bg-rose-50/70 p-3">
                    <p className="text-xs font-semibold text-rose-800">Darurat</p>
                    <p className="mt-0.5 text-[11px] text-rose-700">
                      Segera cari bantuan medis darurat.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          TriageSehat · Dibuat untuk IT RUSH Web Development 2026
        </footer>
      </main>
    </div>
  );
}