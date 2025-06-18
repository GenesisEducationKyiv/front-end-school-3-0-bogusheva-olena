import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { R, pipe } from "@mobily/ts-belt";
import { getGenres } from "../api/genres";
import { logError } from "../utils/utils";

interface GenresContextType {
    genres: string[];
    isLoadingGenres: boolean;
}

const GenresContext = createContext<GenresContextType | undefined>(undefined);

export const GenresProvider = ({ children }: { children: ReactNode }) => {
    const [genres, setAllGenres] = useState<string[]>([]);
    const [isLoadingGenres, setIsLoadingGenres] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            setIsLoadingGenres(true);

            const res = await getGenres();
            pipe(
                res,
                R.tap((res) => {
                    setAllGenres(res);
                }),
                R.tapError((err) => {
                    logError(err, "Failed to load genres");
                })
            );
            setIsLoadingGenres(false);
        };

        void fetchGenres();
    }, []);

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
