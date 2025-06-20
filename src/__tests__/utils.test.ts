import { describe, it, expect } from "vitest";
import { capitalize } from "../utils/utils";

describe("capitalize()", () => {
    it("should capitalize a lowercase word", () => {
        expect(capitalize("rock")).toBe("Rock");
    });

    it("should lowercase the rest of the word", () => {
        expect(capitalize("JAZZ")).toBe("Jazz");
    });

    it("should handle empty string", () => {
        expect(capitalize("")).toBe("");
    });

    it("should return empty string if no argument is passed", () => {
        expect(capitalize()).toBe("");
    });
});

