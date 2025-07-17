import { useQuery } from "@tanstack/react-query";
import { getAllTracks } from "../api/tracks";
import { QUERYKEY } from "../constants";

export const useAllTracksQuery = () =>
    useQuery({
        queryKey: [QUERYKEY.ALL_TRACKS],
        queryFn: getAllTracks,
        staleTime: 1000 * 60 * 5,
    });
