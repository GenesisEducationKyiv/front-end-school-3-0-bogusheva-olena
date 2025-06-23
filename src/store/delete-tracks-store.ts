import { create } from "zustand";

interface DeleteTracksStore {
    selectedToDeleteTracks: string[];
    setSelectedToDeleteTracks: (ids: string[]) => void;
    addToSelected: (id: string) => void;
    removeFromSelected: (id: string) => void;
    toggleSelected: (id: string) => void;
}

export const useDeleteTracksStore = create<DeleteTracksStore>((set, get) => ({
    selectedToDeleteTracks: [],
    setSelectedToDeleteTracks: (ids) => set({ selectedToDeleteTracks: ids }),
    addToSelected: (id) => {
        const prev = get().selectedToDeleteTracks;
        if (!prev.includes(id)) {
            set({ selectedToDeleteTracks: [...prev, id] });
        }
    },
    removeFromSelected: (id) => {
        const prev = get().selectedToDeleteTracks;
        set({
            selectedToDeleteTracks: prev.filter((trackId) => trackId !== id),
        });
    },
    toggleSelected: (id) => {
        const prev = get().selectedToDeleteTracks;
        const next = prev.includes(id)
            ? prev.filter((trackId) => trackId !== id)
            : [...prev, id];
        set({ selectedToDeleteTracks: next });
    },
}));
