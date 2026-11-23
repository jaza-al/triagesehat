import { URGENCY_LEVELS, type Urgency } from "./types";
import type { DurationOption } from "./triage";

export interface TriageCase {
  label: string;
  mainSymptom: string;
  duration: DurationOption;
  severity: number;
  notes?: string;
  expectedUrgency: Urgency;
}

const [SELF_CARE, CLINIC, EMERGENCY] = URGENCY_LEVELS;

export const TRIAGE_CASES: TriageCase[] = [
  {
    label: "Nyeri dada",
    mainSymptom: "Nyeri dada menjalar ke lengan kiri",
    duration: "Kurang dari 1 hari",
    severity: 8,
    expectedUrgency: EMERGENCY,
  },
  {
    label: "Sesak napas",
    mainSymptom: "Sesak napas saat berjalan",
    duration: "Kurang dari 1 hari",
    severity: 7,
    expectedUrgency: EMERGENCY,
  },
  {
    label: "Pingsan (di catatan)",
    mainSymptom: "Lemas dan pusing",
    duration: "1-3 hari",
    severity: 5,
    notes: "Tadi sempat pingsan",
    expectedUrgency: EMERGENCY,
  },
  {
    label: "Demam",
    mainSymptom: "Demam tinggi dan menggigil",
    duration: "1-3 hari",
    severity: 6,
    notes: "Masih bisa minum dan buang air kecil",
    expectedUrgency: CLINIC,
  },
  {
    label: "Keluhan berat",
    mainSymptom: "Badan terasa tidak enak",
    duration: "4-7 hari",
    severity: 9,
    expectedUrgency: CLINIC,
  },
  {
    label: "Batuk pilek",
    mainSymptom: "Batuk dan pilek ringan",
    duration: "4-7 hari",
    severity: 3,
    expectedUrgency: SELF_CARE,
  },
];