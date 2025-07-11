import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadTrackFile } from "../api/tracks";
import { Result } from "@mobily/ts-belt";
import { TrackWithAudioFile, UploadTrackFileArgs } from "../types";
import { QUERYKEY } from "../constants";

export const useUploadTrackFileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Result<TrackWithAudioFile, Error>,
        Error,
        UploadTrackFileArgs
    >({
        mutationFn: uploadTrackFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERYKEY.TRACKS] });
        },
    });
};
