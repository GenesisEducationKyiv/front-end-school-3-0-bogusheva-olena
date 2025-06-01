import { api } from "./axios";
import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { GetTracksParams, Track } from "../types";
import { trackSchema, getTracksResponseSchema } from "../schemas/schemas";

export async function getTracks(
    params?: GetTracksParams,
): Promise<Result<z.infer<typeof getTracksResponseSchema>, Error>> {
    try {
        const res = await api.get("/tracks", { params });
        return ok(getTracksResponseSchema.parse(res.data));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
}

export async function getAllTracks(): Promise<
    Result<z.infer<typeof getTracksResponseSchema>, Error>
> {
    try {
        const res = await api.get("/tracks", { params: { limit: 1000000 } });
        return ok(getTracksResponseSchema.parse(res.data));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
}

export async function updateTrack(
    id: string,
    title: string,
    artist: string,
    album?: string,
    genres?: string[],
    coverImage?: string,
): Promise<Result<Track, Error>> {
    try {
        const res = await api.put(`/tracks/${id}`, {
            title,
            artist,
            album,
            genres,
            coverImage,
        });
        return ok(trackSchema.parse(res.data.data));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
}

export async function createTrack(
    title: string,
    artist: string,
    album?: string,
    genres?: string[],
    coverImage?: string,
): Promise<Result<Track, Error>> {
    try {
        const res = await api.post("/tracks", {
            title,
            artist,
            album,
            genres,
            coverImage,
        });
        return ok(trackSchema.parse(res.data.data));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
}

export async function deleteTrack(id: string): Promise<Result<Track, Error>> {
    try {
        const res = await api.delete(`/tracks/${id}`);
        return ok(trackSchema.parse(res.data.data));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
}

export async function uploadTrackFile(
    id: string,
    file: File,
): Promise<Result<Track, Error>> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post(`/tracks/${id}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return ok(trackSchema.parse(res.data.data));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
}

export async function deleteTrackFile(
    id: string,
): Promise<Result<Track, Error>> {
    try {
        const res = await api.delete(`/tracks/${id}/file`);
        return ok(trackSchema.parse(res.data.data));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
}

export async function deleteTracks(
    ids: string[],
): Promise<Result<void, Error>> {
    try {
        await api.post("/tracks/delete", { ids });
        return ok(undefined);
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
}
