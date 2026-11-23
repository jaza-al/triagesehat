import {
  URGENCY_LEVELS,
  type ScreeningInput,
  type ScreeningResult,
  type Urgency,
} from "./types";

export const DURATION_OPTIONS = [
  "Kurang dari 1 hari",
  "1-3 hari",
  "4-7 hari",
  "Lebih dari 1 minggu",
] as const;

export type DurationOption = (typeof DURATION_OPTIONS)[number];

const [SELF_CARE, CLINIC, EMERGENCY] = URGENCY_LEVELS;

// Pola dicocokkan pada teks yang sudah dinormalisasi (huruf kecil, tanpa tanda baca).
const EMERGENCY_PATTERNS: RegExp[] = [
  /\bsesak( napas)?\b/,
  /\btidak bisa bernapas\b/,
  /\bnapas (sangat )?(berat|pendek|tersengal)\b/,
  /\bnyeri dada\b/,
  /\bpingsan\b/,
  /\btidak sadar(kan)?\b/,
  /\bpenurunan kesadaran\b/,
  /\bsulit dibangunkan\b/,
  /\bkejang\b/,
  /\bbibir( dan kuku)? biru\b/,
  /\b(muntah|batuk|berak|bab) (darah|berdarah)\b/,
  /\bperdarahan (hebat|banyak)\b/,
  /\bwajah mencong\b/,
  /\bbicara pelo\b/,
  /\blengan (atau kaki )?(sebelah )?lemah\b/,
  /\bkeracunan\b/,
  /\bbunuh diri\b/,
];

const URGENT_PATTERN =
  /\b(demam|muntah|diare|dehidrasi|pusing|sakit kepala|nyeri)\b/;

const MAX_LIST_ITEMS = 10;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function urgencyRank(urgency: string): number {
  return URGENCY_LEVELS.indexOf(urgency as Urgency);
}

export function fallbackResult(input: ScreeningInput): ScreeningResult {
  const text = normalize(`${input.mainSymptom} ${input.notes ?? ""}`);
  const emergency = EMERGENCY_PATTERNS.some((pattern) => pattern.test(text));
  const urgent = URGENT_PATTERN.test(text);

  const urgency: Urgency = emergency
    ? EMERGENCY
    : urgent || input.severity >= 8
      ? CLINIC
      : SELF_CARE;

  const reasons: Record<Urgency, string> = {
    [SELF_CARE]: "Keluhan tampaknya dapat dipantau mandiri jika membaik.",
    [CLINIC]: "Keluhan memerlukan pemeriksaan tenaga kesehatan.",
    [EMERGENCY]: "Gejala yang dilaporkan memerlukan penilaian darurat.",
  };

  const firstSteps = emergency
    ? [
        "Segera hubungi 112 atau 118/119. Jangan menunda.",
        "Jangan biarkan pasien sendirian; minta bantuan orang terdekat.",
        "Bawa ke IGD terdekat bila memungkinkan.",
      ]
    : [
        "Istirahat cukup dan catat perubahan gejala.",
        "Pastikan kebutuhan cairan dan nutrisi terpenuhi.",
        "Cari bantuan kesehatan bila gejala memburuk.",
      ];

  return {
    category: emergency
      ? "Darurat"
      : urgent
        ? "Infeksi/keluhan umum"
        : "Keluhan ringan",
    summary: `Keluhan utama: ${input.mainSymptom}. Durasi: ${input.duration}. Tingkat keparahan: ${input.severity}/10.`,
    urgency,
    urgencyReason: reasons[urgency],
    firstSteps,
    education: "Gunakan hasil ini sebagai panduan informasi awal, bukan diagnosis.",
    redFlags: [
      "Sesak napas atau nyeri dada",
      "Pingsan atau sulit dibangunkan",
      "Gejala memburuk dengan cepat",
    ],
    source: "fallback",
    createdAt: new Date().toISOString(),
  };
}

/** Membersihkan pagar markdown (```json) lalu mem-parse JSON. Melempar error bila tidak valid. */
export function parseAiJson(text: string): unknown {
  return JSON.parse(text.replace(/```(?:json)?/gi, "").trim());
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.length <= MAX_LIST_ITEMS &&
  value.every(isNonEmptyString);

/**
 * Memeriksa output AI. Mengembalikan null bila format tidak sesuai.
 * Urgensi tidak boleh lebih rendah dari hasil fallback, sebagai pengaman untuk gejala darurat.
 */
export function validateAiResult(
  raw: unknown,
  input: ScreeningInput,
): ScreeningResult | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  if (
    !isNonEmptyString(r.category) ||
    !isNonEmptyString(r.summary) ||
    !isNonEmptyString(r.urgencyReason) ||
    !isNonEmptyString(r.education)
  ) {
    return null;
  }
  if (!isStringList(r.firstSteps) || !isStringList(r.redFlags)) return null;
  if (urgencyRank(String(r.urgency)) === -1) return null;

  const fallback = fallbackResult(input);
  const aiUrgency = URGENCY_LEVELS[urgencyRank(String(r.urgency))];
  const escalate = urgencyRank(aiUrgency) < urgencyRank(fallback.urgency);

  return {
    category: r.category.trim(),
    summary: r.summary.trim(),
    urgency: escalate ? fallback.urgency : aiUrgency,
    urgencyReason: escalate ? fallback.urgencyReason : r.urgencyReason.trim(),
    firstSteps: r.firstSteps.map((step) => step.trim()),
    education: r.education.trim(),
    redFlags: r.redFlags.map((flag) => flag.trim()),
    source: "ai",
    createdAt: new Date().toISOString(),
  };
}