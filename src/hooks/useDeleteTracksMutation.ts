import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTracks } from "../api/tracks";
import { Result } from "@mobily/ts-belt";
import { DeleteTracksArgs } from "../types";
import { QUERYKEY } from "../constants";

export const useDeleteTracksMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<Result<{}, Error>, Error, DeleteTracksArgs>({
        mutationFn: deleteTracks,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERYKEY.TRACKS] });
        },
    });
};
