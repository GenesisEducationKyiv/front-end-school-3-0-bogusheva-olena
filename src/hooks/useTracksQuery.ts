import { useQuery } from "@tanstack/react-query";
import { getTracks } from "../api/tracks";
import { GetTracksParams } from "../types";

export const useTracksQuery = (params?: GetTracksParams) =>
    useQuery({
        queryKey: ["tracks", params],
        queryFn: () => getTracks(params),
        staleTime: 1000 * 60 * 5,
    });
