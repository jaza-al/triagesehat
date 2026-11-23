"use client";

import { countCategories, type HistoryEntry } from "@/lib/history";

interface Props {
  entries: HistoryEntry[];
  onClear: () => void;
}

export default function HistoryPanel({ entries, onClear }: Props) {
  const counts = countCategories(entries);
  const max = counts[0]?.[1] ?? 1;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Rekap Keluhan Lokal</h2>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-red-600 hover:underline"
          >
            Hapus
          </button>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Tersimpan hanya di browser ini dan anonim (tanpa gejala maupun identitas).
      </p>

      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">Belum ada riwayat skrining.</p>
      ) : (
        <>
          <p className="mt-3 text-sm">
            Total skrining: <strong>{entries.length}</strong>
          </p>
          <ul className="mt-3 space-y-3">
            {counts.map(([category, n]) => (
              <li key={category}>
                <div className="flex justify-between text-sm">
                  <span>{category}</span>
                  <span>{n}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-teal-600"
                    style={{ width: `${(n / max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}