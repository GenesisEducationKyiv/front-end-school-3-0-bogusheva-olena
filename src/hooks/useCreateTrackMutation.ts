import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrack } from "../api/tracks";
import { Result } from "@mobily/ts-belt";
import { CreateTrackArgs, Track } from "../types";
import { QUERYKEY } from "../constants";

export const useCreateTrackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<Result<Track, Error>, Error, CreateTrackArgs>({
        mutationFn: createTrack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERYKEY.TRACKS] });
        },
    });
};
