import { fallbackResult } from "../../lib/triage";
import { TRIAGE_CASES } from "../../lib/triage-cases";

let failed = 0;

for (const c of TRIAGE_CASES) {
  const result = fallbackResult({
    mainSymptom: c.mainSymptom,
    duration: c.duration,
    severity: c.severity,
    notes: c.notes,
  });
  const ok = result.urgency === c.expectedUrgency;
  if (!ok) failed++;

  console.log(
    `${ok ? "PASS" : "FAIL"} | ${c.label} | diharapkan: ${c.expectedUrgency} | hasil: ${result.urgency}`,
  );
}

console.log(failed === 0 ? "Semua skenario lulus." : `${failed} skenario gagal.`);
process.exitCode = failed ? 1 : 0;