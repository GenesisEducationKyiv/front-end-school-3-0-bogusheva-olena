// --- Selectors for track-store.ts ---
import type { TrackStore } from "../types";

export const selectTracks = (s: TrackStore) => s.tracks;
export const selectAllTracksIds = (s: TrackStore) => s.allTracksIds;
export const selectSetTracks = (s: TrackStore) => s.setTracks;
export const selectUpdateTrackInList = (s: TrackStore) => s.updateTrackInList;
export const selectRemoveTrackFromList = (s: TrackStore) =>
    s.removeTrackFromList;
export const selectSetAllTracksIds = (s: TrackStore) => s.setAllTracksIds;

// --- Selectors for delete-tracks-store.ts ---
import type { DeleteTracksStore } from "../types";

export const selectSelectedToDeleteTracks = (s: DeleteTracksStore) =>
    s.selectedToDeleteTracks;
export const selectAddToSelected = (s: DeleteTracksStore) => s.addToSelected;
export const selectRemoveFromSelected = (s: DeleteTracksStore) =>
    s.removeFromSelected;
export const selectToggleSelected = (s: DeleteTracksStore) => s.toggleSelected;
export const selectSetSelectedToDeleteTracks = (s: DeleteTracksStore) =>
    s.setSelectedToDeleteTracks;
