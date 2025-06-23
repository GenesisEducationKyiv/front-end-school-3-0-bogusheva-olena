import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrack } from "../api/tracks";

export const useDeleteTrackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTrack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] });
        },
    });
};
