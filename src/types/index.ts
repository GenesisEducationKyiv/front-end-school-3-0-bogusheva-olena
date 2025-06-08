export * from "./type-guards";

import { z } from "zod";
import {
    getTracksParamsSchema,
    trackFormSchema,
    trackSchema,
} from "../schemas/schemas";
import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "../constants";

export const QUERY_PARAMS_KEYS = [
    "search",
    "sortBy",
    "sortOrder",
    "genre",
    "artist",
    "page",
] as const;

export type QueryParamsKeys = (typeof QUERY_PARAMS_KEYS)[number];

export type SortBy = (typeof SORT_BY_OPTIONS)[number];
export type SortOrder = (typeof SORT_ORDER_OPTIONS)[number];

export type QueryParamsOptions = {
    search: string;
    sortBy: SortBy;
    sortOrder: SortOrder;
    genre: string;
    artist: string;
    page: string;
};

export type GetTracksParams = z.infer<typeof getTracksParamsSchema>;

export type Track = z.infer<typeof trackSchema>;

export type TrackFormValues = z.infer<typeof trackFormSchema>;

export const TRACK_DELETE_MODE = {
    SELECTED: "selected",
    ALL: "all",
} as const;

export type TrackDeleteMode =
    (typeof TRACK_DELETE_MODE)[keyof typeof TRACK_DELETE_MODE];
