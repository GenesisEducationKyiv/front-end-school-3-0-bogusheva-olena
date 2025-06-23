import { useQuery } from "@tanstack/react-query";
import { getAllTracks } from "../api/tracks";

export const useAllTracksQuery = () =>
    useQuery({
        queryKey: ["allTracks"],
        queryFn: getAllTracks,
        staleTime: 1000 * 60 * 5,
    });
