import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { O, pipe } from "@mobily/ts-belt";
import {
    GetTracksParams,
    QueryParamsKeys,
    QueryParamsOptions,
    SortBy,
    SortOrder,
} from "../types";
import {
    INITIAL_PAGE_LIMIT,
    SORT_BY_OPTIONS,
    SORT_ORDER_OPTIONS,
} from "../constants";
import {
    getTracksParamsSchema,
    sortBySchema,
    sortOrderSchema,
} from "../schemas/schemas";

export function useQueryParamsController() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters: QueryParamsOptions = useMemo(() => {
        const getParam = (key: string, fallback = "") =>
            O.getWithDefault(fallback)(O.fromNullable(searchParams.get(key)));

        const parseSortBy = (value: string | null) =>
            O.flatMap((v: string) =>
                sortBySchema.safeParse(v).success ? O.Some(v as SortBy) : O.None
            )(O.fromNullable(value));
        const sortBy = O.getWithDefault<SortBy>(SORT_BY_OPTIONS[0])(
            parseSortBy(searchParams.get("sortBy"))
        );
        const parseSortOrder = (value: string | null) =>
            O.flatMap((v: string) =>
                sortOrderSchema.safeParse(v).success
                    ? O.Some(v as SortOrder)
                    : O.None
            )(O.fromNullable(value));

        const sortOrder = O.getWithDefault<SortOrder>(SORT_ORDER_OPTIONS[0])(
            parseSortOrder(searchParams.get("sortOrder"))
        );

        return {
            sortBy: sortBy,
            sortOrder: sortOrder,
            search: getParam("search"),
            genre: getParam("genre"),
            artist: getParam("artist"),
            page: getParam("page", "1"),
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
    ): GetTracksParams => {
        const baseParams: GetTracksParams = {
            page: Number(filters.page),
            limit: INITIAL_PAGE_LIMIT,
            sort: filters.sortBy,
            order: filters.sortOrder,
            search: filters.search,
            genre: filters.genre,
            artist: filters.artist,
        };

        const entries = Object.entries(baseParams).filter(([key, value]) => {
            if (key === "page" || key === "limit") return true;

            return pipe(
                O.fromNullable(value),
                O.map(String),
                O.map((s) => s.trim()),
                O.filter((s) => s !== ""),
                O.isSome
            );
        });

        const filtered = Object.fromEntries(entries);

        const result = getTracksParamsSchema.safeParse(filtered);

        if (!result.success) {
            console.error("Invalid request params", result.error.format());
            return {
                page: 1,
                limit: INITIAL_PAGE_LIMIT,
            };
        }

        return result.data;
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
