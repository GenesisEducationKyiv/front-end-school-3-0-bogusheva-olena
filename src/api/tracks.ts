import { Track } from "../types";
import { api } from "./axios";

export type GetTracksParams = {
    page?: number;
    limit?: number;
    sort?: "title" | "artist" | "album" | "createdAt";
    order?: "asc" | "desc";
    search?: string;
    genre?: string;
    artist?: string;
};

type GetTracksResponse = {
    data: Track[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

type GetTrackBySlugResponse = {
    id: string;
    title: string;
    artist: string;
    genres: string[];
    slug: string;
    coverImage: string;
    createdAt: string;
    updatedAt: string;
};

export async function getTracks(params?: GetTracksParams): Promise<GetTracksResponse> {
    const res = await api.get<GetTracksResponse>("/tracks", { params });
    return res.data;
}

export async function getAllTracks(): Promise<GetTracksResponse> {
    const res = await api.get<GetTracksResponse>("/tracks", { params: { limit: 1000000 } });
    return res.data;
}

export async function getTrackBySlug(slug: string): Promise<Track> {
    const res = await api.get<GetTrackBySlugResponse>(`/tracks/${slug}`);
    return res.data;
}

export async function updateTrack(
    id: string,
    title: string,
    artist: string,
    album?: string,
    genres?: string[],
    coverImage?: string
): Promise<Track> {
    const res = await api.put<{ data: Track }>(`/tracks/${id}`, {
        title,
        artist,
        album,
        genres,
        coverImage,
    });
    return res.data.data;
}

export async function createTrack(
    title: string,
    artist: string,
    album?: string,
    genres?: string[],
    coverImage?: string
): Promise<Track> {
    const res = await api.post<{ data: Track }>("/tracks", {
        title,
        artist,
        album,
        genres,
        coverImage,
    });
    return res.data.data;
}

export async function deleteTrack(id: string): Promise<Track> {
    const res = await api.delete<{ data: Track }>(`/tracks/${id}`);
    return res.data.data;
}

export async function uploadTrack(id: string, file: File): Promise<Track> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<{ data: Track }>(`/tracks/${id}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data.data;
}

export async function deleteTrackFile(id: string): Promise<Track> {
    const res = await api.delete<{ data: Track }>(`/tracks/${id}/file`);
    return res.data.data;
}

export async function deleteTracks(ids: string[]) {
    await api.post("/tracks/delete", {
        ids,
    });
}
