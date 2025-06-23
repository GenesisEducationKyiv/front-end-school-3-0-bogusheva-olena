import { describe, it, expect, vi, type Mock } from "vitest";
import { createTrack } from "../api/tracks";
import { api } from "../api/axios";
import { R } from "@mobily/ts-belt";

vi.mock("../api/axios", () => ({
    api: {
        post: vi.fn(),
    },
}));

describe("test createTrack function (white-box)", () => {
    const mockResponseTrack = {
        id: "1",
        title: "Test Title",
        artist: "Test Artist",
        album: "Test Album",
        genres: ["Rock"],
        slug: "1",
        coverImage: "",
        createdAt: "2025-06-18T12:00:00Z",
        updatedAt: "2025-06-18T12:00:00Z",
    };

    it("returns Ok result on valid API response", async () => {
        (api.post as Mock).mockResolvedValueOnce({
            data: mockResponseTrack,
        });

        const result = await createTrack({
            title: mockResponseTrack.title,
            artist: mockResponseTrack.artist,
            album: mockResponseTrack.album,
            genres: mockResponseTrack.genres,
            coverImage: mockResponseTrack.coverImage,
        });

        expect(R.isOk(result)).toBe(true);
        if (R.isOk(result)) {
            expect(result._0).toEqual(mockResponseTrack);
        }
    });

    it("returns Error if API fails", async () => {
        (api.post as Mock).mockRejectedValueOnce(new Error("API error"));

        const result = await createTrack({ title: "t", artist: "a" });

        expect(R.isError(result)).toBe(true);
        if (R.isError(result)) {
            expect(result._0).toBeInstanceOf(Error);
        }
    });
});

