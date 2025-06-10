import { z } from "zod";
import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "../constants";

export const genresResponseSchema = z.array(z.string());

export const trackSchema = z.object({
    id: z.string(),
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    genres: z.array(z.string()).optional(),
    slug: z.string(),
    coverImage: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    audioFile: z.string().optional(),
    hasFile: z.boolean().optional(),
});

export const trackSchemaWithoutAudioFile = trackSchema.omit({
    audioFile: true,
});

export const trackSchemaWithAudioFile = trackSchema.extend({
    audioFile: z.string(),
});

export const getTracksResponseSchema = z.object({
    data: z.array(trackSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export const trackResponseSchema = z.object({
    data: trackSchema,
});

export const updateTrackBodySchema = z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    genres: z.array(z.string()).optional(),
    coverImage: z.string().url().optional(),
});

export const trackFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    artist: z.string().min(1, "Artist is required"),
    album: z.string().optional(),
    genres: z.array(z.string()).min(1, "At least one genre is required"),
    coverImage: z
        .string()
        .url("Cover image must be a valid image URL")
        .optional()
        .or(z.literal("")),
});

export const sortBySchema = z.enum(SORT_BY_OPTIONS);
export const sortOrderSchema = z.enum(SORT_ORDER_OPTIONS);

export const getTracksParamsSchema = z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).optional(),
    sort: sortBySchema.optional(),
    order: sortOrderSchema.optional(),
    search: z.string().trim().optional(),
    genre: z.string().trim().optional(),
    artist: z.string().trim().optional(),
});
