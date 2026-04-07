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
  console.log("\n─────────────────────────────────────────────");
  console.log(`  USCIS Case: ${receiptNumber}`);
  console.log(`  Checked at: ${timestamp()}`);
  console.log("─────────────────────────────────────────────");
  console.log(`  Status      : ${caseData.status ?? "n/a"}`);
  console.log(`  Action Code : ${caseData.actionCode ?? "n/a"}`);
  console.log(`  Description : ${caseData.actionDescription ?? "n/a"}`);
  console.log(`  Updated At  : ${caseData.updatedAt ?? "n/a"}`);
  console.log("─────────────────────────────────────────────\n");
}

function printChanges(changes) {
  if (changes.length === 0) {
    console.log("  No changes detected.\n");
    return;
  }

  console.log("\n  *** CHANGES DETECTED ***");
  for (const change of changes) {
    console.log(`\n  [${change.type.toUpperCase()}] ${change.message}`);
    if (change.previous !== undefined) {
      console.log(`    Before : ${change.previous}`);
      console.log(`    After  : ${change.current}`);
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
  printChanges(changes);

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
