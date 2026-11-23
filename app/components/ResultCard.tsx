import type { ScreeningResult } from "@/lib/types";

export default function ResultCard({ result }: { result: ScreeningResult }) {
  return (
    <article className="space-y-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <section>
        <h3 className="mb-2 font-semibold">1. Ringkasan Kondisi Awal</h3>
        <p className="text-slate-700">{result.summary}</p>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">2. Tingkat Urgensi</h3>
        <div className="rounded-xl border border-slate-300 p-4">
          <p className="font-bold">{result.urgency}</p>
          <p className="mt-1 text-sm text-slate-700">{result.urgencyReason}</p>
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">3. Langkah Perawatan Awal</h3>
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          {result.firstSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
        <p className="mt-3 text-slate-700">{result.education}</p>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">4. Tanda Bahaya</h3>
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          {result.redFlags.map((flag, index) => (
            <li key={index}>{flag}</li>
          ))}
        </ul>
      </section>

      <p className="rounded-xl bg-slate-100 p-4 text-xs text-slate-600">
        Hasil ini hanya informasi edukatif dan bukan pengganti diagnosis dari tenaga kesehatan.
      </p>
    </article>
  );
}
