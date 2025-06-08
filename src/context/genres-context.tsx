import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { R, pipe } from "@mobily/ts-belt";
import { getGenres } from "../api/genres";

interface GenresContextType {
    genres: string[];
    isLoadingGenres: boolean;
}

const GenresContext = createContext<GenresContextType | undefined>(undefined);

export const GenresProvider = ({ children }: { children: ReactNode }) => {
    const [genres, setAllGenres] = useState<string[]>([]);
    const [isLoadingGenres, setIsLoadingGenres] = useState(true);

    useEffect(() => {
        setIsLoadingGenres(true);

        void getGenres().then((res) => {
            pipe(
                res,
                R.tap((res) => {
                    setAllGenres(res);
                }),
                R.tapError((err) => {
                    console.error("Failed to load genres:", err);
                })
            );
        });

        setIsLoadingGenres(false);
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
