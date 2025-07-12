import { O } from "@mobily/ts-belt";
import { QueryParamsKey } from "../types";
import { QUERY_PARAMS } from "../constants";

export function useFilterParams(searchParams: URLSearchParams) {
    const getParam = (key: QueryParamsKey, fallback = "") =>
        O.getWithDefault(fallback)(O.fromNullable(searchParams.get(key)));

    return {
        search: getParam(QUERY_PARAMS.search),
        genre: getParam(QUERY_PARAMS.genre),
        artist: getParam(QUERY_PARAMS.artist),
    };
}
