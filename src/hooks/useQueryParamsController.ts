import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getValidParam, QueryParamsKeys, QueryParamsOptions } from "../types";
import {
    INITIAL_PAGE_LIMIT,
    SORT_BY_OPTIONS,
    SORT_ORDER_OPTIONS,
} from "../constants";

export function useQueryParamsController() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters: QueryParamsOptions = useMemo(() => {
        return {
            search: searchParams.get("search") ?? "",
            sortBy: getValidParam(
                searchParams.get("sortBy"),
                SORT_BY_OPTIONS,
                SORT_BY_OPTIONS[0]
            ),
            sortOrder: getValidParam(
                searchParams.get("sortOrder"),
                SORT_ORDER_OPTIONS,
                SORT_ORDER_OPTIONS[0]
            ),
            genre: searchParams.get("genre") ?? "",
            artist: searchParams.get("artist") ?? "",
            page: searchParams.get("page") ?? "1",
        };
    }, [searchParams]);

    const updateQueryParam = (
        key: QueryParamsKeys,
        value: string,
        options?: { resetPage?: boolean }
    ) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        if (key !== "page" && options?.resetPage !== false) {
            newParams.set("page", "1");
        }

        if (newParams.get("page") === "1") {
            newParams.delete("page");
        }

        setSearchParams(newParams);
    };

    const buildRequestParams = (
        filters: QueryParamsOptions
    ): Record<string, string | number> => {
        const { sortBy, sortOrder, search, genre, artist, page } = filters;

        const baseParams = {
            page: Number(page),
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
                return (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
                );
            })
        );

        return filteredParams;
    };

    const requestTracksParams = buildRequestParams(filters);

    const resetAllQueryParams = () => {
        const newParams = new URLSearchParams();
        setSearchParams(newParams);
    };

    return {
        filters,
        updateQueryParam,
        requestTracksParams,
        resetAllQueryParams,
    };
}
