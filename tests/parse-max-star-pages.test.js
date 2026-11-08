import { describe, expect, test } from "vitest";

import { parseMaxStarPages } from "../action.js";

describe("parseMaxStarPages", () => {
  test.each([
    ["empty string", "", ""],
    ["zero (every page)", "0", "true"],
    ["one", "1", "1"],
    ["ten", "10", "10"],
  ])("accepts %s", (_name, value, expected) => {
    expect(parseMaxStarPages(value)).toBe(expected);
  });

  test.each([["-1"], ["1.5"], ["01"], ["true"], ["all"]])(
    "rejects %s",
    (value) => {
      expect(() => parseMaxStarPages(value)).toThrow("max_star_pages");
    },
  );
});
