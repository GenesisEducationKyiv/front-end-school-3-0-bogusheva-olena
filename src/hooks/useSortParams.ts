import { O } from "@mobily/ts-belt";
import { useMemo } from "react";
import { sortBySchema, sortOrderSchema } from "../schemas/schemas";
import {
    QUERY_PARAMS,
    SORT_BY_OPTIONS,
    SORT_ORDER_OPTIONS,
} from "../constants";
import { SortBy, SortOrder } from "../types";

export function useSortParams(searchParams: URLSearchParams) {
    const sortBy = useMemo(() => {
        const parseSortBy = (value: string | null) =>
            O.flatMap((v: string) =>
                sortBySchema.safeParse(v).success ? O.Some(v as SortBy) : O.None
            )(O.fromNullable(value));
        return O.getWithDefault<SortBy>(SORT_BY_OPTIONS[0])(
            parseSortBy(searchParams.get(QUERY_PARAMS.sortBy))
        );
    }, [searchParams]);

    const sortOrder = useMemo(() => {
        const parseSortOrder = (value: string | null) =>
            O.flatMap((v: string) =>
                sortOrderSchema.safeParse(v).success
                    ? O.Some(v as SortOrder)
                    : O.None
            )(O.fromNullable(value));
        return O.getWithDefault<SortOrder>(SORT_ORDER_OPTIONS[0])(
            parseSortOrder(searchParams.get(QUERY_PARAMS.sortOrder))
        );
    }, [searchParams]);

    return { sortBy, sortOrder };
}
