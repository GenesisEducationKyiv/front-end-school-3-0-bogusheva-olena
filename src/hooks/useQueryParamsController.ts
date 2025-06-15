import { useSearchParams } from "react-router-dom";
import { O, pipe } from "@mobily/ts-belt";
import { GetTracksParams, QueryParamsKey, QueryParamsOptions } from "../types";
import { INITIAL_PAGE_LIMIT, QUERY_PARAMS } from "../constants";
import { getTracksParamsSchema } from "../schemas/schemas";
import { logError } from "../utils/utils";
import { useSortParams } from "./useSortParams";
import { usePaginationParams } from "./usePaginationParams";
import { useFilterParams } from "./useFilterParams";
import { useMemo } from "react";

export function useQueryParamsController() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { sortBy, sortOrder } = useSortParams(searchParams);
    const { page } = usePaginationParams(searchParams);
    const { search, genre, artist } = useFilterParams(searchParams);

    const filters = useMemo<QueryParamsOptions>(
        () => ({
            sortBy,
            sortOrder,
            search,
            genre,
            artist,
            page,
        }),
        [sortBy, sortOrder, search, genre, artist, page]
    );

    const updateQueryParam = (
        key: QueryParamsKey,
        value: string,
        options?: { resetPage?: boolean }
    ) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        if (key !== QUERY_PARAMS.page && options?.resetPage !== false) {
            newParams.set(QUERY_PARAMS.page, "1");
        }

        if (newParams.get(QUERY_PARAMS.page) === "1") {
            newParams.delete(QUERY_PARAMS.page);
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
            logError(result.error, "Invalid request params");
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
