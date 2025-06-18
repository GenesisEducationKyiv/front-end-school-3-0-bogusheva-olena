import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { R, pipe } from "@mobily/ts-belt";
import { Track } from "../types";
import { getAllTracks } from "../api/tracks";
import { logError } from "../utils/utils";

interface TrackListContextType {
    tracks: Track[];
    setTracks: (tracks: Track[]) => void;
    updateTrackList: () => void;
    updateCounter: number;
    updateTrackInList: (track: Track) => void;
    removeTrackFromList: (id: string) => void;
    addTrackToList: (track: Track) => void;
    isLoadingTracks: boolean;
    setIsLoadingTracks: (isLoading: boolean) => void;
    allTracksIds: string[];
    isLoadingAllTracks: boolean;
}

const TrackListContext = createContext<TrackListContextType | undefined>(
    undefined
);

export const TrackListProvider = ({ children }: { children: ReactNode }) => {
    const [updateCounter, setUpdateCounter] = useState(0);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoadingTracks, setIsLoadingTracks] = useState(true);
    const [allTracksIds, setAllTracksIds] = useState<string[]>([]);
    const [isLoadingAllTracks, setIsLoadingAllTracks] = useState(true);

    useEffect(() => {
        const fetchAllTracks = async () => {
            setIsLoadingAllTracks(true);

            const res = await getAllTracks();
            pipe(
                res,
                R.tap((res) => {
                    setAllTracksIds(res.data.map((track) => track.id));
                }),
                R.tapError((err) => {
                    logError(err, "Error fetching all tracks");
                })
            );

            setIsLoadingAllTracks(false);
        };

        void fetchAllTracks();
    }, []);

    const updateTrackList = () => {
        setUpdateCounter((prev) => prev + 1);
    };

    const updateTrackInList = (track: Track) => {
        setTracks((prev) => prev.map((t) => (t.id === track.id ? track : t)));
    };

    const removeTrackFromList = (id: string) => {
        setTracks((prev) => prev.filter((t) => t.id !== id));
    };

    const addTrackToList = (track: Track) => {
        setTracks((prev) => [track, ...prev]);
    };

    return (
        <TrackListContext.Provider
            value={{
                tracks,
                setTracks,
                updateTrackList,
                updateCounter,
                updateTrackInList,
                removeTrackFromList,
                addTrackToList,
                isLoadingTracks,
                setIsLoadingTracks,
                allTracksIds,
                isLoadingAllTracks,
            }}
        >
            {children}
        </TrackListContext.Provider>
    );
};

export const useTrackList = () => {
    const context = useContext(TrackListContext);
    if (!context)
        throw new Error("useTrackList must be used within TrackListProvider");
    return context;
};
