import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ScreeningInput } from "@/lib/types";
import {
  DURATION_OPTIONS,
  fallbackResult,
  parseAiJson,
  validateAiResult,
} from "@/lib/triage";

const MAX_SYMPTOM = 200;
const MAX_NOTES = 500;

function parseInput(body: unknown): ScreeningInput | string {
  if (typeof body !== "object" || body === null) {
    return "Payload JSON tidak valid.";
  }
  const b = body as Record<string, unknown>;

  const mainSymptom = typeof b.mainSymptom === "string" ? b.mainSymptom.trim() : "";
  if (!mainSymptom) return "Gejala utama wajib diisi.";
  if (mainSymptom.length > MAX_SYMPTOM) {
    return `Gejala utama maksimal ${MAX_SYMPTOM} karakter.`;
  }

  const duration = b.duration;
  if (
    typeof duration !== "string" ||
    !(DURATION_OPTIONS as readonly string[]).includes(duration)
  ) {
    return "Durasi keluhan tidak valid.";
  }

  const severity = b.severity;
  if (
    typeof severity !== "number" ||
    !Number.isInteger(severity) ||
    severity < 1 ||
    severity > 10
  ) {
    return "Tingkat keparahan harus berupa angka 1-10.";
  }

  const notes = typeof b.notes === "string" ? b.notes.trim() : "";
  if (notes.length > MAX_NOTES) {
    return `Catatan maksimal ${MAX_NOTES} karakter.`;
  }

  return { mainSymptom, duration, severity, notes: notes || undefined };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload JSON tidak valid." }, { status: 400 });
  }

  const parsed = parseInput(body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }
  const input = parsed;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(fallbackResult(input));
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Anda adalah asisten edukasi kesehatan. Berikan respons JSON untuk skrining awal.
Jangan mendiagnosis atau mengganti tenaga medis.
Gunakan urgency salah satu dari: "Pemantauan Mandiri & Edukasi", "Konsultasi Puskesmas/Klinik", "Segera ke IGD / Fasilitas Darurat".
Format wajib:
{"category":string,"summary":string,"urgency":string,"urgencyReason":string,"firstSteps":string[],"education":string,"redFlags":string[]}
Input: ${JSON.stringify(input)}
Prioritaskan tanda bahaya dan respons aman.`;

    const response = await model.generateContent(prompt);
    const validated = validateAiResult(parseAiJson(response.response.text()), input);

    if (!validated) {
      console.warn("Format respons AI tidak valid, memakai panduan fallback.");
      return NextResponse.json(fallbackResult(input));
    }

    return NextResponse.json(validated);
  } catch (error) {
    console.error("Analisis AI gagal, menggunakan panduan fallback:", error);
    return NextResponse.json(fallbackResult(input));
  }
}