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
    setHistory(loadHistory());
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
    <div className="min-h-screen bg-gradient-to-b from-teal-50/70 via-white to-slate-50 text-slate-800">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-lg font-extrabold text-white shadow-xs">
              +
            </div>
            <div>
              <p className="text-base font-bold leading-tight tracking-tight text-slate-900">
                Triage<span className="text-teal-600">Sehat</span>
              </p>
              <p className="text-xs text-slate-500">
                Skrining Cepat, Penanganan Tepat
              </p>
            </div>
          </div>
          <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            AI Skrining Awal
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {/* Hero Section */}
        <section className="mb-6 text-center">
          <span className="inline-block rounded-full bg-teal-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800">
            IT RUSH Web Development 2026 · Kesehatan Masyarakat
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Cek Tingkat Urgensi Gejala Anda dalam Hitungan Detik
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Platform skrining awal gejala &amp; edukasi kesehatan berbasis AI untuk membantu memahami prioritas penanganan sebelum berkonsultasi dengan tenaga medis.
          </p>
        </section>

        {/* Disclaimer Banner */}
        <div
          role="note"
          className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm leading-relaxed text-amber-950 shadow-xs"
        >
          <strong>Disclaimer:</strong> Hasil skrining ini hanya informasi edukatif awal dan{" "}
          <strong>bukan pengganti diagnosis atau saran medis</strong> dari dokter atau tenaga
          kesehatan. Jika kondisi memburuk atau darurat, segera hubungi <strong>112</strong> atau{" "}
          <strong>118/119</strong>.
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
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 p-8 text-center">
                <p className="text-sm font-medium text-slate-700">
                  Belum ada hasil skrining
                </p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Isi formulir gejala di sebelah kiri lalu kirim untuk melihat tingkat urgensi dan panduan awal.
                </p>
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