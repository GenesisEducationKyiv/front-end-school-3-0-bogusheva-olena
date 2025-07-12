import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrackFile } from "../api/tracks";
import { QUERYKEY } from "../constants";

export const useDeleteTrackFileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTrackFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERYKEY.TRACKS] });
        },
    });
};
