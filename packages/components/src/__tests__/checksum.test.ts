import { describe, expect, it } from "vitest";
import { computeChecksum } from "../checksum.js";

describe("computeChecksum", () => {
	it("returns a sha256 hex digest for a string", () => {
		const result = computeChecksum("hello world");
		expect(result).toMatch(/^[a-f0-9]{64}$/);
	});

	it("returns the same hash for the same content", () => {
		const a = computeChecksum("test content");
		const b = computeChecksum("test content");
		expect(a).toBe(b);
	});

	it("returns different hashes for different content", () => {
		const a = computeChecksum("content a");
		const b = computeChecksum("content b");
		expect(a).not.toBe(b);
	});
});
