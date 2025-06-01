import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
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
        getGenres()
            .then((res) => {
                res.match(
                    (res) => {
                        setAllGenres(res);
                    },
                    (error) => {
                        console.error("Failed to load genres:", error);
                    },
                );
            })
            .finally(() => {
                setIsLoadingGenres(false);
            });
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
