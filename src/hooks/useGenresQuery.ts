import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../api/genres";
import { QUERYKEY } from "../constants";

export const useGenresQuery = () =>
    useQuery({
        queryKey: [QUERYKEY.GENRES],
        queryFn: getGenres,
        staleTime: Infinity,
    });
