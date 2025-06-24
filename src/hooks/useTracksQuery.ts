import { useQuery } from "@tanstack/react-query";
import { getTracks } from "../api/tracks";
import { GetTracksParams } from "../types";
import { QUERYKEY } from "../constants";

export const useTracksQuery = (params?: GetTracksParams) =>
    useQuery({
        queryKey: [QUERYKEY.TRACKS, params],
        queryFn: () => getTracks(params),
        staleTime: 1000 * 60 * 5,
    });
