import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { R, pipe } from "@mobily/ts-belt";
import { logError } from "../utils/utils";
import { useGenresQuery } from "../hooks/useGenresQuery";

type GenresContextType = {
    genres: string[];
    isLoadingGenres: boolean;
};

export const GenresContext = createContext<GenresContextType | undefined>(
    undefined
);

export const GenresProvider = ({ children }: { children: ReactNode }) => {
    const [genres, setGenres] = useState<string[]>([]);
    const { data: res, isLoading: isLoadingGenres } = useGenresQuery();
    useEffect(() => {
        if (!res) return;

        pipe(
            res,
            R.tap((data) => {
                setGenres(data);
            }),
            R.tapError((err) => {
                logError(err, "Failed to load genres");
            })
        );
    }, [res]);

    return (
        <GenresContext.Provider
            value={{
                genres,
                isLoadingGenres,
            }}
        >
            {children}
        </GenresContext.Provider>
    );
};

export const useGenres = () => {
    const context = useContext(GenresContext);
    if (!context)
        throw new Error("useGenres must be used within GenreProvider");
    return context;
};
