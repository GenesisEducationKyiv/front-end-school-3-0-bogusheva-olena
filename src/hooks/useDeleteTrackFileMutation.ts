import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrackFile } from "../api/tracks";

export const useDeleteTrackFileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTrackFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] });
        },
    });
};
