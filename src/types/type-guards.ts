import { QUERY_PARAMS } from "../constants";

const allowedKeys = Object.values(QUERY_PARAMS) as readonly string[];

export function isFilterKey(
    value: string
): value is (typeof QUERY_PARAMS)[keyof typeof QUERY_PARAMS] {
    return allowedKeys.includes(value);
}

export function getValidParam<T extends string>(
    raw: string | null,
    validOptions: readonly T[],
    fallback: T
): T {
    return raw && validOptions.includes(raw as T) ? (raw as T) : fallback;
}
