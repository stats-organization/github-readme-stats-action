import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { expect, test } from "vitest";

test("the generate step runs from an action directory containing spaces", () => {
  const actionDir = mkdtempSync(path.join(os.tmpdir(), "stats action "));
  try {
    // Use a tiny entry point to exercise the actual shell command without API calls.
    writeFileSync(
      path.join(actionDir, "index.js"),
      'console.log("entry point executed");',
    );
    const manifest = readFileSync(
      new URL("../action.yml", import.meta.url),
      "utf8",
    );
    const step = manifest.split("- name: Generate card")[1];
    const command = step
      .match(/^\s+run: (.+)$/m)[1]
      .replaceAll("${{ github.action_path }}", actionDir);
    const output = execFileSync("bash", ["-e", "-c", command], {
      env: { ...process.env, ACTION_PATH: actionDir },
      encoding: "utf8",
    });
    expect(output.trim()).toBe("entry point executed");
  } finally {
    rmSync(actionDir, { recursive: true, force: true });
  }
});
