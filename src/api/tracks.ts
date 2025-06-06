import { api } from "./axios";
import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { GetTracksParams, Track } from "../types";
import { trackSchema, getTracksResponseSchema } from "../schemas/schemas";
import { normalizeError } from "../utils/utils";
import { API_ROUTES, COLLECTION_TRACKS_LIMIT } from "../constants";

export async function getTracks(
    params?: GetTracksParams
): Promise<Result<z.infer<typeof getTracksResponseSchema>, Error>> {
    try {
        const res = await api.get(API_ROUTES.TRACKS, { params });
        return ok(getTracksResponseSchema.parse(res.data));
    } catch (e) {
        return err(normalizeError(e));
    }
}

export async function getAllTracks(): Promise<
    Result<z.infer<typeof getTracksResponseSchema>, Error>
> {
    try {
        const res = await api.get(API_ROUTES.TRACKS, {
            params: { limit: COLLECTION_TRACKS_LIMIT },
        });
        return ok(getTracksResponseSchema.parse(res.data));
    } catch (e) {
        return err(normalizeError(e));
    }
}

export async function updateTrack(
    id: string,
    title: string,
    artist: string,
    album?: string,
    genres?: string[],
    coverImage?: string
): Promise<Result<Track, Error>> {
    try {
        const res = await api.put(API_ROUTES.SINGLE_TRACK(id), {
            title,
            artist,
            album,
            genres,
            coverImage,
        });
        return ok(trackSchema.parse(res.data));
    } catch (e) {
        return err(normalizeError(e));
    }
}

export async function createTrack(
    title: string,
    artist: string,
    album?: string,
    genres?: string[],
    coverImage?: string
): Promise<Result<Track, Error>> {
    try {
        const res = await api.post(API_ROUTES.TRACKS, {
            title,
            artist,
            album,
            genres,
            coverImage,
        });
        return ok(trackSchema.parse(res.data));
    } catch (e) {
        return err(normalizeError(e));
    }
}

export async function deleteTrack(id: string): Promise<Result<void, Error>> {
    try {
        await api.delete(API_ROUTES.SINGLE_TRACK(id));
        return ok(undefined);
    } catch (e) {
        return err(normalizeError(e));
    }
}

export async function uploadTrackFile(
    id: string,
    file: File
): Promise<Result<Track, Error>> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post(API_ROUTES.UPLOAD_TRACK_FILE(id), formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return ok(trackSchema.parse(res.data));
    } catch (e) {
        return err(normalizeError(e));
    }
}

export async function deleteTrackFile(
    id: string
): Promise<Result<Track, Error>> {
    try {
        const res = await api.delete(API_ROUTES.DELETE_TRACK_FILE(id));
        return ok(trackSchema.parse(res.data));
    } catch (e) {
        return err(normalizeError(e));
    }
}

export async function deleteTracks(
    ids: string[]
): Promise<Result<void, Error>> {
    try {
        await api.post(API_ROUTES.DELETE_TRACKS, { ids });
        return ok(undefined);
    } catch (e) {
        return err(normalizeError(e));
    }
}
