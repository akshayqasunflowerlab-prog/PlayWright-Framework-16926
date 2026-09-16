/* eslint-disable no-console */
import * as fs from "node:fs";
import * as path from "node:path";

import type {
    FullConfig,
    FullResult,
    Reporter,
    Suite,
    TestCase,
    TestResult,
} from "@playwright/test/reporter";

/** Display label for each Playwright outcome surfaced by the reporter. */
type DisplayStatus = "PASSED" | "FAILED" | "SKIPPED" | "FLAKY";

/**
 * JSON payload written to `tta-report/summary.json` at the end of the run.
 * Kept flat and stable so downstream tooling (dashboards, CI status posts)
 * can consume it without a schema library.
 */
interface SummaryPayload {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    durationMs: number;
    status: FullResult["status"];
    startedAt: string;
    finishedAt: string;
}

/**
 * Resolve the human-friendly status label for a test, accounting for the
 * Playwright convention that a test which fails and then passes on retry
 * is reported as `expected` with `result.retry > 0` — surfaced here as
 * FLAKY so reviewers can spot instability at a glance.
 */
function deriveDisplayStatus(
    test: TestCase,
    result: TestResult,
): DisplayStatus {
    if (result.status === "skipped") {
        return "SKIPPED";
    }
    if (result.status === "passed" && result.retry > 0) {
        return "FLAKY";
    }
    if (test.outcome() === "flaky") {
        return "FLAKY";
    }
    if (result.status === "passed") {
        return "PASSED";
    }
    return "FAILED";
}

/**
 * Build the dotted suite path for a test (e.g. `login.spec.ts > smoke`)
 * by walking up the parent chain and skipping the synthetic root suite.
 */
function suitePath(test: TestCase): string {
    const parts: string[] = [];
    let current: Suite | undefined = test.parent;
    while (current && current.title !== "") {
        parts.unshift(current.title);
        current = current.parent;
    }
    return parts.join(" > ");
}

/**
 * CustomTTAReporter — Playwright reporter that streams a one-line status
 * for each test as it finishes and writes a JSON summary to disk so the
 * TTA tooling can ingest results without parsing the HTML report.
 */
export class CustomTTAReporter implements Reporter {
    private totalTests = 0;
    private passed = 0;
    private failed = 0;
    private skipped = 0;
    private flaky = 0;
    private startedAt = 0;

    /**
     * Called once when Playwright begins the run. Records the total test
     * count (for summary math) and the wall-clock start (for duration).
     */
    public onBegin(_config: FullConfig, suite: Suite): void {
        this.totalTests = suite.allTests().length;
        this.startedAt = Date.now();
        console.log(`TTA reporter started — ${this.totalTests} tests`);
    }

    /**
     * Called after each test result lands. Emits one log line in the form
     * `[STATUS] suite > test (Xms)` and increments the matching counter.
     */
    public onTestEnd(test: TestCase, result: TestResult): void {
        const status = deriveDisplayStatus(test, result);
        const suite = suitePath(test);
        const durationMs = Math.round(result.duration);
        console.log(`[${status}] ${suite} > ${test.title} (${durationMs}ms)`);

        switch (status) {
            case "PASSED":
                this.passed += 1;
                break;
            case "FAILED":
                this.failed += 1;
                break;
            case "SKIPPED":
                this.skipped += 1;
                break;
            case "FLAKY":
                this.flaky += 1;
                break;
            default: {
                const exhaustive: never = status;
                throw new Error(`Unexpected status: ${String(exhaustive)}`);
            }
        }
    }

    /**
     * Called once when the whole run finishes. Prints the human summary,
     * then writes `tta-report/summary.json` so CI jobs and dashboards can
     * pick the result up without scraping stdout.
     */
    public onEnd(result: FullResult): void {
        const finishedAt = Date.now();
        const durationMs = finishedAt - this.startedAt;

        console.log("──────── TTA Summary ────────");
        console.log(`Total:    ${this.totalTests}`);
        console.log(`Passed:   ${this.passed}`);
        console.log(`Failed:   ${this.failed}`);
        console.log(`Skipped:  ${this.skipped}`);
        console.log(`Flaky:    ${this.flaky}`);
        console.log(`Duration: ${durationMs}ms`);
        console.log(`Status:   ${result.status}`);
        console.log("─────────────────────────────");

        const payload: SummaryPayload = {
            total: this.totalTests,
            passed: this.passed,
            failed: this.failed,
            skipped: this.skipped,
            flaky: this.flaky,
            durationMs,
            status: result.status,
            startedAt: new Date(this.startedAt).toISOString(),
            finishedAt: new Date(finishedAt).toISOString(),
        };

        try {
            const outDir = path.resolve(process.cwd(), "tta-report");
            fs.mkdirSync(outDir, { recursive: true });
            const outFile = path.join(outDir, "summary.json");
            fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
            console.log(`TTA summary written to ${outFile}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.warn(`TTA reporter failed to write summary.json: ${message}`);
        }
    }
}

export default CustomTTAReporter;