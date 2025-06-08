import { QUERY_PARAMS_KEYS, QueryParamsKeys } from ".";

export function isFilterKey(value: string): value is QueryParamsKeys {
    return (QUERY_PARAMS_KEYS as readonly string[]).includes(value);
}

export function getValidParam<T extends string>(
    raw: string | null,
    validOptions: readonly T[],
    fallback: T
): T {
    return raw && validOptions.includes(raw as T) ? (raw as T) : fallback;
}
