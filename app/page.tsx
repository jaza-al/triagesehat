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
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-6 text-center">
        <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800">
          IT RUSH Web Development 2026 · Kesehatan Masyarakat
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          TriageSehat
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Platform skrining awal gejala &amp; edukasi kesehatan berbasis AI
        </p>
      </header>

      <div
        role="note"
        className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm leading-relaxed text-amber-950 shadow-xs"
      >
        <strong>Disclaimer:</strong> Hasil skrining ini hanya informasi edukatif awal dan{" "}
        <strong>bukan pengganti diagnosis atau saran medis</strong> dari dokter atau tenaga
        kesehatan. Jika kondisi memburuk atau darurat, segera hubungi <strong>112</strong> atau{" "}
        <strong>118/119</strong>.
      </div>

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
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-8 text-center">
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
  );
}