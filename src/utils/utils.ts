export const capitalize = (value: string = ""): string =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export function lockScroll(isLocked: boolean): void {
    const html = document.querySelector("html");
    if (html instanceof HTMLElement) {
        html.style.overflow = isLocked ? "hidden" : "";
    }
}

export function normalizeError(e: unknown): Error {
    return e instanceof Error ? e : new Error("Unknown error");
}
