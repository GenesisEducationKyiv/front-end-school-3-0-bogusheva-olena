import { create } from "zustand";
import { Track } from "../types";

type TrackStore = {
    tracks: Track[];
    allTracksIds: string[];
    setTracks: (tracks: Track[]) => void;
    updateTrackInList: (track: Track) => void;
    removeTrackFromList: (id: string) => void;
    setAllTracksIds: (ids: string[]) => void;
};

export const useTrackStore = create<TrackStore>((set) => ({
    tracks: [],
    allTracksIds: [],
    setTracks: (tracks) => set({ tracks }),
    updateTrackInList: (track) =>
        set((state) => ({
            tracks: state.tracks.map((t) => (t.id === track.id ? track : t)),
        })),
    removeTrackFromList: (id) =>
        set((state) => ({
            tracks: state.tracks.filter((t) => t.id !== id),
        })),
    setAllTracksIds: (ids) => set({ allTracksIds: ids }),
}));
