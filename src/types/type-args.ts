export type CreateTrackArgs = {
    title: string;
    artist: string;
    album?: string;
    genres?: string[];
    coverImage?: string;
};

export type UploadTrackFileArgs = {
    id: string;
    file: File;
};

export type UpdateTrackArgs = {
    id: string;
    title: string;
    artist: string;
    album?: string;
    genres?: string[];
    coverImage?: string;
};

export type DeleteTracksArgs = {
    ids: string[];
};
