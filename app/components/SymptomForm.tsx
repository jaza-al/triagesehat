"use client";

import { useState, type FormEvent } from "react";
import type { ScreeningInput } from "@/lib/types";
import { DURATION_OPTIONS } from "@/lib/triage";
import { TRIAGE_CASES, type TriageCase } from "@/lib/triage-cases";

interface Props {
  onSubmit: (data: ScreeningInput) => void;
  loading: boolean;
}

export default function SymptomForm({ onSubmit, loading }: Props) {
  const [mainSymptom, setMainSymptom] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function applyCase(c: TriageCase) {
    setMainSymptom(c.mainSymptom);
    setDuration(c.duration);
    setSeverity(c.severity);
    setNotes(c.notes ?? "");
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!mainSymptom.trim()) {
      setError("Tuliskan gejala utama Anda.");
      return;
    }

    if (!duration) {
      setError("Pilih durasi keluhan.");
      return;
    }

    setError("");
    onSubmit({
      mainSymptom: mainSymptom.trim(),
      duration,
      severity,
      notes: notes.trim() || undefined,
    });
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-teal-600 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
    >
      <h2 className="text-lg font-semibold">Formulir Skrining</h2>

      <div>
        <p className="mb-2 text-sm font-medium">Contoh cepat (uji coba)</p>
        <div className="flex flex-wrap gap-2">
          {TRIAGE_CASES.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => applyCase(c)}
              disabled={loading}
              className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100 disabled:opacity-60"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="mainSymptom" className="mb-1 block text-sm font-medium">
          Gejala utama *
        </label>
        <input
          id="mainSymptom"
          className={inputClass}
          value={mainSymptom}
          maxLength={200}
          onChange={(event) => setMainSymptom(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="duration" className="mb-1 block text-sm font-medium">
          Durasi keluhan *
        </label>
        <select
          id="duration"
          className={inputClass}
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
        >
          <option value="">Pilih durasi</option>
          {DURATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="severity" className="mb-1 block text-sm font-medium">
          Tingkat keparahan: {severity}/10
        </label>
        <input
          id="severity"
          type="range"
          min={1}
          max={10}
          value={severity}
          onChange={(event) => setSeverity(Number(event.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium">
          Catatan tambahan
        </label>
        <textarea
          id="notes"
          rows={3}
          className={inputClass}
          value={notes}
          maxLength={500}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Menganalisis..." : "Analisis Gejala"}
      </button>
    </form>
  );
}