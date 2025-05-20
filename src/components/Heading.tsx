import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";

import { FilterOptions } from "../types";
import { capitalize } from "../utils/utils";

import { useDeleteTracks } from "../context/delete-tracks-context";
import { useTrackList } from "../context/track-list-context";
import { useModal } from "../hooks/useModal";

import CreateTrackModal from "./CreateTrackModal";
import DeleteTracksModal from "./DeleteTracksModal";
import { useGenres } from "../context/genres-context";

interface FiltersProps {
    filters: FilterOptions;
    setFilters: Dispatch<SetStateAction<FilterOptions>>;
    setPage: Dispatch<SetStateAction<number>>;
    setTotalPages: Dispatch<SetStateAction<number>>;
}

export default function Heading({ filters, setFilters, setPage, setTotalPages }: FiltersProps) {
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search || "");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { selectedToDeleteTracks } = useDeleteTracks();
    const { genres, isLoadingGenres } = useGenres();
    const { isLoadingTracks } = useTrackList();
    const { openModal: openCreateModal, closeModal: closeCreateModal, isModalOpened: isCreateModalOpened } = useModal();
    const {
        openModal: openDeleteTracksModal,
        closeModal: closeDeleteTracksModal,
        isModalOpened: isDeleteTracksModalOpened,
    } = useModal();

    const sortByOptions = ["title", "artist", "album", "createdAt"];
    const sortOrderOptions = ["asc", "desc"];
    const OptionsMapping: Record<string, string> = {
        title: "Title",
        artist: "Artist",
        album: "Album",
        createdAt: "Date",
        asc: "↑ Ascending",
        desc: "↓ Descending",
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (debouncedSearch !== filters.search) {
                setFilters((prev) => ({
                    ...prev,
                    search: debouncedSearch,
                }));
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [debouncedSearch, filters.search, setFilters]);

    const matchingGenres =
        filters.genre.length > 0 ? genres.filter((g) => g.toLowerCase().startsWith(filters.genre.toLowerCase())) : [];

    const handleGenreSelect = (genre: string) => {
        setFilters((prev) => ({ ...prev, genre }));
        setShowSuggestions(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "search") {
            setDebouncedSearch(value);
        } else {
            setFilters((prev) => ({
                ...prev,
                [name]: name === "genre" ? capitalize(value) : value,
            }));
        }
    };

    return (
        <>
            <div className="mb-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 lg:max-w-[80%] self-center mx-auto mb-2">
                    <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                        data-testid="sort-select"
                        disabled={isLoadingTracks}
                    >
                        {sortByOptions.map((option) => (
                            <option key={option} value={option}>
                                {OptionsMapping[option]}
                            </option>
                        ))}
                    </select>
                    <select
                        name="sortOrder"
                        value={filters.sortOrder}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                        disabled={isLoadingTracks}
                    >
                        {sortOrderOptions.map((option) => (
                            <option key={option} value={option}>
                                {OptionsMapping[option]}
                            </option>
                        ))}
                    </select>
                    <button
                        className="bg-red-600 w-full text-white px-2 py-1 rounded hover:bg-red-700 disabled:bg-gray-400"
                        type="button"
                        onClick={openDeleteTracksModal}
                        disabled={isLoadingTracks || !selectedToDeleteTracks.length}
                        aria-disabled={isLoadingTracks}
                        data-loading={isLoadingTracks || undefined}
                        data-testid="delete-tracks-button"
                    >
                        Delete tracks
                    </button>
                    <button
                        className="bg-green-600 w-full text-white px-2 py-1 rounded hover:bg-green-700 disabled:bg-gray-400"
                        type="button"
                        onClick={openCreateModal}
                        disabled={isLoadingTracks}
                        aria-disabled={isLoadingTracks}
                        data-loading={isLoadingTracks || undefined}
                        data-testid="create-track-button"
                    >
                        Create Track
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-x-4 gap-y-2">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search..."
                        value={debouncedSearch}
                        onChange={handleChange}
                        disabled={isLoadingTracks}
                        className="border p-1 rounded w-full"
                        data-testid="search-input"
                    />
                    <div className="relative w-full">
                        <input
                            type="text"
                            name="genre"
                            placeholder="Search genre..."
                            value={filters?.genre || ""}
                            onChange={(e) => {
                                handleChange(e);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                            className="border p-1 rounded w-full"
                            data-testid="filter-genre"
                            disabled={isLoadingTracks || isLoadingGenres}
                        />
                        {showSuggestions && matchingGenres.length > 0 && (
                            <ul className="absolute left-0 top-full mt-1 bg-white border rounded w-full shadow z-10">
                                {matchingGenres.map((genre) => (
                                    <li
                                        key={genre}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={() => handleGenreSelect(genre)}
                                    >
                                        {genre}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <input
                        type="text"
                        name="artist"
                        placeholder="Search artist..."
                        value={filters.artist || ""}
                        onChange={handleChange}
                        disabled={isLoadingTracks}
                        className="border p-1 rounded w-full"
                        data-testid="filter-artist"
                    />
                </div>
            </div>
            <CreateTrackModal isModalOpened={isCreateModalOpened} closeModal={closeCreateModal} />
            <DeleteTracksModal
                isModalOpened={isDeleteTracksModalOpened}
                closeModal={closeDeleteTracksModal}
                setPage={setPage}
                setTotalPages={setTotalPages}
            />
        </>
    );
}
