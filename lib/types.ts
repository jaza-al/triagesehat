export const URGENCY_LEVELS = [
  "Pemantauan Mandiri & Edukasi",
  "Konsultasi Puskesmas/Klinik",
  "Segera ke IGD / Fasilitas Darurat",
] as const;

export type Urgency = (typeof URGENCY_LEVELS)[number];

export interface ScreeningInput {
  ageGroup?: string;
  mainSymptom: string;
  duration: string;
  severity: number; // 1 - 10
  notes?: string;
  region?: string;
}

export interface ScreeningResult {
  category: string;
  summary: string;
  urgency: Urgency;
  urgencyReason: string;
  firstSteps: string[];
  education: string;
  redFlags: string[];
  source: "ai" | "rule" | "fallback";
  createdAt: string;
}