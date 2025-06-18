export * from "./type-guards";

import { z } from "zod";
import {
    getTracksParamsSchema,
    trackFormSchema,
    trackSchema,
    trackSchemaWithAudioFile,
    trackSchemaWithoutAudioFile,
} from "../schemas/schemas";
import {
    QUERY_PARAMS,
    SORT_BY_OPTIONS,
    SORT_ORDER_OPTIONS,
} from "../constants";

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

export type QueryParamsKey = keyof typeof QUERY_PARAMS;

export type GetTracksParams = z.infer<typeof getTracksParamsSchema>;

export type Track = z.infer<typeof trackSchema>;
export type TrackWithoutAudioFile = z.infer<typeof trackSchemaWithoutAudioFile>;
export type TrackWithAudioFile = z.infer<typeof trackSchemaWithAudioFile>;

export type TrackFormValues = z.infer<typeof trackFormSchema>;

export const TRACK_DELETE_MODE = {
    SELECTED: "selected",
    ALL: "all",
} as const;

export type TrackDeleteMode =
    (typeof TRACK_DELETE_MODE)[keyof typeof TRACK_DELETE_MODE];
