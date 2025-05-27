import { INITIAL_PAGE_LIMIT } from "../constants";
import { FilterOptions } from "../types";

export function buildQueryParams(filters: FilterOptions, page: number) {
    const { sortBy, sortOrder, search, genre, artist } = filters;

    const baseParams = {
        page: page,
        limit: INITIAL_PAGE_LIMIT,
        sort: sortBy,
        order: sortOrder,
        search,
        genre,
        artist,
    };

    const filteredParams = Object.fromEntries(
        Object.entries(baseParams).filter(([key, value]) => {
            if (key === "page" || key === "limit") return true;
            return value !== undefined && value !== null && String(value).trim() !== "";
        })
    );

    return filteredParams;
}

export const capitalize = (value: string = "") => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export function lockScroll(isLocked: boolean) {
    document.querySelector("html")!.style.overflow = isLocked ? "hidden" : "";
}
