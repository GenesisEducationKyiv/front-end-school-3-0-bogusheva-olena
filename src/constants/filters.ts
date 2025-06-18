export const SORT_BY_OPTIONS = [
    "title",
    "artist",
    "album",
    "createdAt",
] as const;

export const SORT_ORDER_OPTIONS = ["asc", "desc"] as const;

export const FILTER_LABELS: Record<string, string> = {
    title: "Title",
    artist: "Artist",
    album: "Album",
    createdAt: "Date",
    asc: "↑ Ascending",
    desc: "↓ Descending",
};
