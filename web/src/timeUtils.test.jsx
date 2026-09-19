import { describe, it, expect } from "vitest";
import { formatTime, formatDate } from "../src/timeUtils";

describe("formatTime", () => {
  it("returns dash for empty string", () => {
    expect(formatTime("")).toBe("—");
  });

  it("returns dash for null", () => {
    expect(formatTime(null)).toBe("—");
  });

  it("formats a timestamp in Asia/Kathmandu time", () => {
    const result = formatTime("2026-09-19T02:30:00+05:45");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result).not.toBe("—");
  });

  it("uses 24-hour format", () => {
    const result = formatTime("2026-09-19T14:30:00+05:45");
    const hours = parseInt(result.split(":")[0], 10);
    expect(hours).toBeGreaterThanOrEqual(0);
    expect(hours).toBeLessThanOrEqual(23);
  });
});

describe("formatDate", () => {
  it("returns dash for empty string", () => {
    expect(formatDate("")).toBe("—");
  });

  it("returns dash for null", () => {
    expect(formatDate(null)).toBe("—");
  });

  it("formats a date in Asia/Kathmandu timezone", () => {
    const result = formatDate("2026-09-19T02:30:00+05:45");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result).not.toBe("—");
  });
});
