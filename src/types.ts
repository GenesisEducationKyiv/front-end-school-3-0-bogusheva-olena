import { z } from "zod";
import { trackFormSchema, trackSchema } from "./schemas/schemas";

export type FilterOptions = {
    sortBy: "title" | "artist" | "album" | "createdAt";
    sortOrder: "asc" | "desc";
    search: string;
    genre: string;
    artist: string;
};

export type GetTracksParams = {
    page?: number;
    limit?: number;
    sort?: "title" | "artist" | "album" | "createdAt";
    order?: "asc" | "desc";
    search?: string;
    genre?: string;
    artist?: string;
};

export type Track = z.infer<typeof trackSchema>;

export type TrackFormValues = z.infer<typeof trackFormSchema>;

export const TRACK_DELETE_MODE = {
  SELECTED: "selected",
  ALL: "all",
} as const;

export type TrackDeleteMode = (typeof TRACK_DELETE_MODE)[keyof typeof TRACK_DELETE_MODE];