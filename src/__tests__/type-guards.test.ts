import { describe, it, expect } from "vitest";
import { isFilterKey } from "../types/type-guards";

describe("isFilterKey", () => {
    it("returns true for valid query param keys", () => {
        expect(isFilterKey("genre")).toBe(true);
        expect(isFilterKey("search")).toBe(true);
        expect(isFilterKey("artist")).toBe(true);
        expect(isFilterKey("sortBy")).toBe(true);
        expect(isFilterKey("sortOrder")).toBe(true);
        expect(isFilterKey("page")).toBe(true);
    });

    it("returns false for invalid keys", () => {
        expect(isFilterKey("")).toBe(false);
        expect(isFilterKey("invalid")).toBe(false);
        expect(isFilterKey("Genre")).toBe(false);
        expect(isFilterKey("page=1")).toBe(false);
    });
});

