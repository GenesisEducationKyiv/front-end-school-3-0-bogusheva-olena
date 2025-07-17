import { api } from "./axios";
import { infer as zInfer } from "zod";
import { Result, R } from "@mobily/ts-belt";
import {
    CreateTrackArgs,
    DeleteTracksArgs,
    GetTracksParams,
    Track,
    TrackWithAudioFile,
    TrackWithoutAudioFile,
    UpdateTrackArgs,
    UploadTrackFileArgs,
} from "../types";
import {
    trackSchema,
    getTracksResponseSchema,
    trackSchemaWithoutAudioFile,
    trackSchemaWithAudioFile,
} from "../schemas/schemas";
import { normalizeError } from "../utils/utils";
import { API_ROUTES, COLLECTION_TRACKS_LIMIT } from "../constants";

export async function getTracks(
    params?: GetTracksParams
): Promise<Result<zInfer<typeof getTracksResponseSchema>, Error>> {
    const res = await R.fromPromise(api.get(API_ROUTES.TRACKS, { params }));

    if (R.isError(res)) {
        return R.Error(normalizeError(res._0));
    }

    const parsed = getTracksResponseSchema.safeParse(res._0.data);

    return parsed.success
        ? R.Ok(parsed.data)
        : R.Error(new Error("Invalid track data"));
}

export async function getAllTracks(): Promise<
    Result<zInfer<typeof getTracksResponseSchema>, Error>
> {
    const res = await R.fromPromise(
        api.get(API_ROUTES.TRACKS, {
            params: { limit: COLLECTION_TRACKS_LIMIT },
        })
    );

    if (R.isError(res)) {
        return R.Error(normalizeError(res._0));
    }

    const parsed = getTracksResponseSchema.safeParse(res._0.data);

    return parsed.success
        ? R.Ok(parsed.data)
        : R.Error(new Error("Invalid track data"));
}

export async function updateTrack({
    id,
    title,
    artist,
    album,
    genres,
    coverImage,
}: UpdateTrackArgs): Promise<Result<Track, Error>> {
    const res = await R.fromPromise(
        api.put(API_ROUTES.SINGLE_TRACK(id), {
            title,
            artist,
            album,
            genres,
            coverImage,
        })
    );
    if (R.isError(res)) {
        return R.Error(normalizeError(res._0));
    }

    const parsed = trackSchema.safeParse(res._0.data);

    return parsed.success
        ? R.Ok(parsed.data)
        : R.Error(new Error("Invalid updated track data"));
}

export async function createTrack({
    title,
    artist,
    album,
    genres,
    coverImage,
}: CreateTrackArgs): Promise<Result<Track, Error>> {
    const res = await R.fromPromise(
        api.post(API_ROUTES.TRACKS, {
            title,
            artist,
            album,
            genres,
            coverImage,
        })
    );
    if (R.isError(res)) {
        return R.Error(normalizeError(res._0));
    }

    const parsed = trackSchema.safeParse(res._0.data);

    return parsed.success
        ? R.Ok(parsed.data)
        : R.Error(new Error("Invalid created track data"));
}

export async function deleteTrack(id: string): Promise<R.Result<{}, Error>> {
    const res = await R.fromPromise(api.delete(API_ROUTES.SINGLE_TRACK(id)));
    return R.isOk(res) ? R.Ok({}) : R.Error(normalizeError(res._0));
}

export async function uploadTrackFile({
    id,
    file,
}: UploadTrackFileArgs): Promise<Result<TrackWithAudioFile, Error>> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await R.fromPromise(
        api.post(API_ROUTES.UPLOAD_TRACK_FILE(id), formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    );
    if (R.isError(res)) {
        return R.Error(normalizeError(res._0));
    }
    const parsed = trackSchemaWithAudioFile.safeParse(res._0.data);

    return parsed.success
        ? R.Ok(parsed.data)
        : R.Error(new Error("Invalid uploaded file data"));
}

export async function deleteTrackFile(
    id: string
): Promise<Result<TrackWithoutAudioFile, Error>> {
    const res = await R.fromPromise(
        api.delete(API_ROUTES.DELETE_TRACK_FILE(id))
    );

    if (R.isError(res)) {
        return R.Error(normalizeError(res._0));
    }

    const parsed = trackSchemaWithoutAudioFile.safeParse(res._0.data);

    return parsed.success
        ? R.Ok(parsed.data)
        : R.Error(new Error("Invalid deleted file data"));
}

export async function deleteTracks({
    ids,
}: DeleteTracksArgs): Promise<Result<{}, Error>> {
    const res = await R.fromPromise(
        api.post(API_ROUTES.DELETE_TRACKS, { ids })
    );

    return R.isOk(res) ? R.Ok({}) : R.Error(normalizeError(res._0));
}
