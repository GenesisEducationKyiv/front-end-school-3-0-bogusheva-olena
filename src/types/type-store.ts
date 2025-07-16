import { Track } from "./type-main";

export type TrackStore = {
    tracks: Track[];
    allTracksIds: string[];
    setTracks: (tracks: Track[]) => void;
    updateTrackInList: (track: Track) => void;
    removeTrackFromList: (id: string) => void;
    setAllTracksIds: (ids: string[]) => void;
};

export type DeleteTracksStore = {
    selectedToDeleteTracks: string[];
    setSelectedToDeleteTracks: (ids: string[]) => void;
    addToSelected: (id: string) => void;
    removeFromSelected: (id: string) => void;
    toggleSelected: (id: string) => void;
};
