import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TrackForm from "../components/TrackForm";

describe("test TrackForm component (integration)", () => {
    const genres = ["Rock", "Jazz", "Pop"];
    const onSubmit = vi.fn();
    const closeModal = vi.fn();

    it("shows validation errors when submitting empty form", async () => {
        render(
            <TrackForm
                genres={genres}
                closeModal={closeModal}
                isLoading={false}
                onSubmit={onSubmit}
            />
        );

        const submitButton = screen.getByTestId("submit-button");

        fireEvent.click(submitButton);

        expect(await screen.findByTestId("error-title")).toHaveTextContent(
            "Title is required"
        );
        expect(await screen.findByTestId("error-artist")).toHaveTextContent(
            "Artist is required"
        );
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit with correct data when form is valid", async () => {
        const mockSubmit = vi.fn();
        const mockClose = vi.fn();

        render(
            <TrackForm
                genres={["Rock", "Jazz"]}
                closeModal={mockClose}
                onSubmit={mockSubmit}
                isLoading={false}
            />
        );

        fireEvent.change(screen.getByTestId("input-title"), {
            target: { value: "Song title" },
        });
        fireEvent.change(screen.getByTestId("input-artist"), {
            target: { value: "Unknown Artist" },
        });

        fireEvent.click(screen.getByText("+ Rock"));

        fireEvent.click(screen.getByTestId("submit-button"));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                {
                    title: "Song title",
                    artist: "Unknown Artist",
                    album: "",
                    genres: ["Rock"],
                    coverImage: "",
                },
                expect.any(Object)
            );
        });
    });

    it("shows error for invalid coverImage URL", async () => {
        render(
            <TrackForm
                genres={genres}
                closeModal={closeModal}
                isLoading={false}
                onSubmit={onSubmit}
            />
        );

        fireEvent.change(screen.getByTestId("input-title"), {
            target: { value: "Title" },
        });
        fireEvent.change(screen.getByTestId("input-artist"), {
            target: { value: "Artist" },
        });
        fireEvent.change(screen.getByTestId("input-cover-image"), {
            target: { value: "not-a-url" },
        });

        fireEvent.click(screen.getByTestId("submit-button"));

        expect(await screen.findByTestId("error-coverImage")).toHaveTextContent(
            "Cover image must be a valid image URL"
        );

        expect(onSubmit).not.toHaveBeenCalled();
    });
});

