export const API_ROUTES = {
    TRACKS: "/tracks",
    SINGLE_TRACK: (id: string) => `/tracks/${id}`,
    UPLOAD_TRACK_FILE: (id: string) => `/tracks/${id}/upload`,
    DELETE_TRACK_FILE: (id: string) => `/tracks/${id}/file`,
    DELETE_TRACKS: "/tracks/delete",
    GENRES: "/genres",
};
