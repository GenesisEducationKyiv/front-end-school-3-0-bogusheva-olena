import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../api/genres";

export const useGenresQuery = () =>
    useQuery({
        queryKey: ["genres"],
        queryFn: getGenres,
        staleTime: Infinity,
    });
