import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTrack } from "../api/tracks";
import { Result } from "@mobily/ts-belt";
import { Track, UpdateTrackArgs } from "../types";

export const useUpdateTrackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<Result<Track, Error>, Error, UpdateTrackArgs>({
        mutationFn: updateTrack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] });
        },
    });
};
