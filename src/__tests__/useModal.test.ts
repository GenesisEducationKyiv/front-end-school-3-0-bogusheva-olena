import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useModal } from "../hooks/useModal";
import * as scroll from "../utils/utils";

describe("useModal (white-box)", () => {
    let spy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        spy = vi.spyOn(scroll, "lockScroll");
    });

    afterEach(() => {
        spy.mockRestore();
    });

    it("opens and closes modal, and calls lockScroll correctly", () => {
        const { result } = renderHook(() => useModal());

        act(() => {
            result.current.openModal();
        });
        expect(result.current.isModalOpened).toBe(true);
        expect(spy).toHaveBeenCalledWith(true);

        act(() => {
            result.current.closeModal();
        });
        expect(result.current.isModalOpened).toBe(false);
        expect(spy).toHaveBeenCalledWith(false);
    });

    it("isModalOpened is false by default", () => {
        const { result } = renderHook(() => useModal());
        expect(result.current.isModalOpened).toBe(false);
    });

    it("does not call lockScroll on init", () => {
        renderHook(() => useModal());
        expect(spy).not.toHaveBeenCalled();
    });
});

