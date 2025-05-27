export type Track = {
    id: string;
    title: string;
    artist: string;
    album?: string;
    genres?: string[];
    coverImage?: string;
    hasFile?: boolean;
    audioFile?: string | null;
    createdAt: string;
    updatedAt: string;
    slug: string;
};

export type FilterOptions = {
    sortBy: "title" | "artist" | "album" | "createdAt";
    sortOrder: "asc" | "desc";
    search: string;
    genre: string;
    artist: string;
};
