#!/usr/bin/env node
/**
 * USCIS Silent Update Checker
 *
 * Detects "silent updates" — backend case changes that appear in the USCIS
 * internal API (egov.uscis.gov/csol-api) before (or without) a notification
 * being sent to the applicant.
 *
 * Usage:
 *   node uscis-silent-update-checker.mjs <RECEIPT_NUMBER> [--interval <minutes>]
 *
 * Examples:
 *   node uscis-silent-update-checker.mjs IOE0123456789
 *   node uscis-silent-update-checker.mjs IOE0123456789 --interval 30
 *
 * The script saves state to uscis-case-state.json so it persists across runs.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────

const USCIS_AUTH_URL = "https://egov.uscis.gov/csol-api/ui-auth";
const USCIS_STATUS_URL = (receiptNumber) =>
  `https://egov.uscis.gov/csol-api/case-statuses/${receiptNumber}`;

const STATE_FILE = path.join(__dirname, "uscis-case-state.json");

const DEFAULT_INTERVAL_MINUTES = 30;
const REQUEST_TIMEOUT_MS = 15_000;

// ── Action code reference ─────────────────────────────────────────────────────
// Source: community reports from Lawfully, GC Pathways, USCIS tracker sites.
// These are internal USCIS codes returned by the csol-api.

const ACTION_CODES = {
  // ── Receipt & intake ───────────────────────────────────────────────────────
  RCV0: {
    label: "Case Was Received",
    meaning: "USCIS received your application. You're in the queue. I-797C receipt notice will be mailed.",
    stage: "intake",
  },
  FTA0: {
    label: "Fingerprint Fee Received",
    meaning: "Biometrics fee processed. Biometrics appointment letter coming soon.",
    stage: "intake",
  },

  // ── Active review ──────────────────────────────────────────────────────────
  PRB0: {
    label: "Case Is Being Actively Reviewed",
    meaning: "An officer is adjudicating your case. Can stay here for weeks or months.",
    stage: "review",
  },
  INT0: {
    label: "Interview Was Scheduled",
    meaning: "In-person interview scheduled. Standard for family-based I-485; often skipped for employment-based.",
    stage: "review",
  },

  // ── Evidence / notices ─────────────────────────────────────────────────────
  RFE0: {
    label: "Request for Evidence",
    meaning: "USCIS needs additional documents. Not a denial — respond thoroughly before the deadline.",
    stage: "action_required",
  },
  NTR0: {
    label: "Notice of Intent to Deny",
    meaning: "Pre-denial warning. You have a chance to respond before a final decision is issued.",
    stage: "action_required",
  },

  // ── Transfer / field office ────────────────────────────────────────────────
  TRN0: {
    label: "Case Was Transferred",
    meaning: "Case moved to another service center. Usually administrative — no action needed.",
    stage: "transfer",
  },
  SLM0: {
    label: "Transferred to Local Field Office",
    meaning: "Case sent to a local USCIS office. Typically means an interview is approaching.",
    stage: "transfer",
  },

  // ── Decision ───────────────────────────────────────────────────────────────
  APR0: {
    label: "Case Was Approved",
    meaning: "Approved! For I-485: green card granted. Physical card/document will be mailed soon.",
    stage: "approved",
  },
  H008: {
    label: "Approved (alternate code)",
    meaning: "Approval — alternate code seen on some IOE cases. Same outcome as APR0.",
    stage: "approved",
  },
  DEN0: {
    label: "Case Was Denied",
    meaning: "Case denied. Review the denial notice carefully — appeal or reapply options may exist.",
    stage: "denied",
  },

  // ── Post-approval / card production ───────────────────────────────────────
  PRD0: {
    label: "Card Was Produced",
    meaning: "Green card / EAD printed and handed to USPS for delivery.",
    stage: "post_approval",
  },
  WCD0: {
    label: "Card Was Delivered",
    meaning: "Physical card delivered. Case fully complete.",
    stage: "post_approval",
  },
};

// Silent-update-only interpretation (when only updatedAt changes, no code change)
const SILENT_UPDATE_STAGES = {
  intake:         "File touched during intake — likely routine system processing.",
  review:         "Officer accessed your file. Active adjudication in progress.",
  action_required:"File touched while RFE/NOID is open — may indicate review of your response.",
  transfer:       "Administrative update during transfer.",
  approved:       "Post-approval file access — card production likely being prepared.",
  denied:         "File accessed post-denial — may relate to appeal/motion processing.",
  post_approval:  "Card production/delivery update.",
  unknown:        "Backend activity detected. Status update may follow in 1–5 days.",
};

function describeCode(code) {
  const info = ACTION_CODES[code?.toUpperCase()];
  if (!info) return null;
  return info;
}

function describeChange(currentCode, previousCode) {
  const curr = describeCode(currentCode);
  const prev = describeCode(previousCode);
  const lines = [];
  if (curr) {
    lines.push(`  What it means : ${curr.meaning}`);
  }
  if (prev && curr && prev.stage !== curr.stage) {
    lines.push(`  Stage change  : ${prev.stage} → ${curr.stage}`);
  }
  return lines.join("\n");
}

// ── Arg parsing ───────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const receiptNumber = args.find((a) => !a.startsWith("--"));
  const intervalIdx = args.indexOf("--interval");
  const intervalMinutes =
    intervalIdx !== -1
      ? parseInt(args[intervalIdx + 1], 10)
      : DEFAULT_INTERVAL_MINUTES;

  if (!receiptNumber) {
    console.error("Usage: node uscis-silent-update-checker.mjs <RECEIPT_NUMBER> [--interval <minutes>]");
    process.exit(1);
  }

  return { receiptNumber: receiptNumber.toUpperCase(), intervalMinutes };
}

// ── State persistence ─────────────────────────────────────────────────────────

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ── USCIS API ─────────────────────────────────────────────────────────────────

/**
 * Fetches a short-lived auth token from the USCIS session endpoint.
 * The public case-status page does this automatically in the browser.
 */
async function getAuthToken() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(USCIS_AUTH_URL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
        Accept: "application/json",
        Referer: "https://egov.uscis.gov/casestatus/mycasestatus.do",
      },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Auth request failed: ${res.status} ${res.statusText}`);
    const data = await res.json();

    // Token may be in different fields depending on the API version
    const token =
      data?.token ||
      data?.access_token ||
      data?.authToken ||
      res.headers.get("x-auth-token");

    if (!token) throw new Error("No auth token found in response");
    return token;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches case status from the internal USCIS API.
 * Returns the parsed JSON response.
 */
async function fetchCaseStatus(receiptNumber, authToken) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(USCIS_STATUS_URL(receiptNumber), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
        Accept: "application/json",
        Referer: "https://egov.uscis.gov/casestatus/mycasestatus.do",
      },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Status request failed: ${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ── Response parsing ──────────────────────────────────────────────────────────

/**
 * Extracts the meaningful fields from the USCIS API response.
 * The internal API returns nested data under CaseStatusResponse.
 */
function parseCaseData(raw) {
  const csr =
    raw?.cases?.[0]?.CaseStatusResponse ||
    raw?.CaseStatusResponse ||
    raw?.response?.CaseStatusResponse ||
    raw;

  return {
    receiptNumber: csr?.receiptNumber || csr?.receipt_number || "unknown",
    actionCode: csr?.actionCodeText || csr?.actionCode || null,
    actionDescription: csr?.actionCodeDesc || csr?.description || null,
    formType: csr?.benefitRequestID || csr?.form || null,
    updatedAt: csr?.updatedDate || csr?.updatedAt || csr?.lastUpdated || null,
    status: csr?.caseStatus || csr?.status || null,
    raw: csr,
  };
}

// ── Change detection ──────────────────────────────────────────────────────────

/**
 * Compares current case data against stored state and returns a list of
 * detected changes (including silent updates).
 */
function detectChanges(receiptNumber, current, state) {
  const prev = state[receiptNumber];
  const changes = [];

  if (!prev) {
    changes.push({ type: "initial", message: "First check — baseline recorded." });
    return changes;
  }

  // Timestamp changed → backend touched the case (classic "silent update")
  if (current.updatedAt && prev.updatedAt && current.updatedAt !== prev.updatedAt) {
    changes.push({
      type: "silent_update",
      message: `SILENT UPDATE detected — updatedAt changed`,
      previous: prev.updatedAt,
      current: current.updatedAt,
    });
  }

  // Visible action code changed
  if (current.actionCode && prev.actionCode && current.actionCode !== prev.actionCode) {
    changes.push({
      type: "action_code_change",
      message: `Action code changed`,
      previous: prev.actionCode,
      current: current.actionCode,
    });
  }

  // Visible status text changed
  if (current.actionDescription && prev.actionDescription &&
      current.actionDescription !== prev.actionDescription) {
    changes.push({
      type: "status_change",
      message: `Status description changed`,
      previous: prev.actionDescription,
      current: current.actionDescription,
    });
  }

  // Overall status field changed
  if (current.status && prev.status && current.status !== prev.status) {
    changes.push({
      type: "overall_status_change",
      message: `Overall status changed`,
      previous: prev.status,
      current: current.status,
    });
  }

  return changes;
}

// ── Reporting ─────────────────────────────────────────────────────────────────

function timestamp() {
  return new Date().toLocaleString();
}

function printStatus(receiptNumber, caseData) {
  const codeInfo = describeCode(caseData.actionCode);
  console.log("\n─────────────────────────────────────────────────────────────");
  console.log(`  USCIS Case  : ${receiptNumber}`);
  console.log(`  Checked at  : ${timestamp()}`);
  console.log("─────────────────────────────────────────────────────────────");
  console.log(`  Status      : ${caseData.status ?? "n/a"}`);
  console.log(`  Action Code : ${caseData.actionCode ?? "n/a"}${codeInfo ? ` — ${codeInfo.label}` : ""}`);
  if (codeInfo) {
    console.log(`  Meaning     : ${codeInfo.meaning}`);
    console.log(`  Stage       : ${codeInfo.stage}`);
  }
  console.log(`  Description : ${caseData.actionDescription ?? "n/a"}`);
  console.log(`  Updated At  : ${caseData.updatedAt ?? "n/a"}`);
  console.log("─────────────────────────────────────────────────────────────\n");
}

function printChanges(changes, currentCode, previousCode) {
  if (changes.length === 0) {
    console.log("  No changes detected.\n");
    return;
  }

  console.log("\n  *** CHANGES DETECTED ***");
  for (const change of changes) {
    console.log(`\n  [${change.type.toUpperCase()}] ${change.message}`);

    if (change.type === "silent_update") {
      // Look up what the current code's stage implies for silent updates
      const codeInfo = describeCode(currentCode);
      const stage = codeInfo?.stage ?? "unknown";
      console.log(`  What it means : ${SILENT_UPDATE_STAGES[stage]}`);
      console.log(`    Before : ${change.previous}`);
      console.log(`    After  : ${change.current}`);
    } else if (change.type === "action_code_change") {
      console.log(`    Before : ${change.previous}${describeCode(change.previous) ? ` (${describeCode(change.previous).label})` : ""}`);
      console.log(`    After  : ${change.current}${describeCode(change.current) ? ` (${describeCode(change.current).label})` : ""}`);
      const explanation = describeChange(change.current, change.previous);
      if (explanation) console.log(explanation);
    } else {
      if (change.previous !== undefined) {
        console.log(`    Before : ${change.previous}`);
        console.log(`    After  : ${change.current}`);
      }
    }
  }
  console.log();
}

// ── Main check loop ───────────────────────────────────────────────────────────

async function checkOnce(receiptNumber, state) {
  let authToken;

  // Step 1: Get auth token
  try {
    authToken = await getAuthToken();
  } catch (err) {
    console.error(`[${timestamp()}] Failed to get auth token: ${err.message}`);
    return state;
  }

  // Step 2: Fetch case status
  let raw;
  try {
    raw = await fetchCaseStatus(receiptNumber, authToken);
  } catch (err) {
    console.error(`[${timestamp()}] Failed to fetch case status: ${err.message}`);
    return state;
  }

  // Step 3: Parse and compare
  const caseData = parseCaseData(raw);
  printStatus(receiptNumber, caseData);

  const changes = detectChanges(receiptNumber, caseData, state);
  printChanges(changes, caseData.actionCode, state[receiptNumber]?.actionCode);

  // Step 4: Persist new state
  state[receiptNumber] = {
    actionCode: caseData.actionCode,
    actionDescription: caseData.actionDescription,
    status: caseData.status,
    updatedAt: caseData.updatedAt,
    lastChecked: new Date().toISOString(),
    changeHistory: [
      ...(state[receiptNumber]?.changeHistory ?? []),
      ...changes
        .filter((c) => c.type !== "initial")
        .map((c) => ({ ...c, detectedAt: new Date().toISOString() })),
    ],
  };

  saveState(state);
  return state;
}

async function main() {
  const { receiptNumber, intervalMinutes } = parseArgs();
  let state = loadState();

  console.log(`\nUSCIS Silent Update Checker`);
  console.log(`Receipt Number : ${receiptNumber}`);
  console.log(`Poll Interval  : ${intervalMinutes} minute(s)`);
  console.log(`State File     : ${STATE_FILE}\n`);

  // Run immediately, then on interval
  state = await checkOnce(receiptNumber, state);

  if (intervalMinutes > 0) {
    const ms = intervalMinutes * 60 * 1000;
    console.log(`Next check in ${intervalMinutes} minute(s)... (Ctrl+C to stop)\n`);
    setInterval(async () => {
      state = await checkOnce(receiptNumber, state);
      console.log(`Next check in ${intervalMinutes} minute(s)...\n`);
    }, ms);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
