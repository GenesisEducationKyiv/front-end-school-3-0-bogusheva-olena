import { useMemo } from "react";
import { QUERY_PARAMS } from "../constants";

export function usePaginationParams(searchParams: URLSearchParams) {
    const page = useMemo(() => {
        return searchParams.get(QUERY_PARAMS.page) ?? "1";
    }, [searchParams]);

    return { page };
}
