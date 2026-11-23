export interface HistoryEntry {
  createdAt: string;
  category: string;
  urgency: string;
}

const KEY = "triagesehat:riwayat-anonim";
const MAX_ENTRIES = 50;

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.createdAt === "string" &&
    typeof v.category === "string" &&
    typeof v.urgency === "string"
  );
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(isHistoryEntry).slice(0, MAX_ENTRIES)
      : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
    return true;
  } catch {
    // Biasanya karena kuota penuh.
    return false;
  }
}

export function addHistory(entry: HistoryEntry) {
  if (typeof window === "undefined") return;

  const next = [entry, ...loadHistory()].slice(0, MAX_ENTRIES);
  if (!saveHistory(next)) {
    // Coba lagi dengan setengah data lama.
    saveHistory(next.slice(0, Math.floor(MAX_ENTRIES / 2)));
  }
}

export function clearHistory() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Abaikan bila storage tidak tersedia.
  }
}

export function countCategories(entries: HistoryEntry[]): [string, number][] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}