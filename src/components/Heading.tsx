import React, {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";

import { capitalize } from "../utils/utils";
import {
    FILTER_LABELS,
    QUERY_PARAMS,
    SEARCH_DEBOUNCE_MS,
    SORT_BY_OPTIONS,
    SORT_ORDER_OPTIONS,
} from "../constants";
import {
    CreateTrackModalProps,
    DeleteTracksModalProps,
    isFilterKey,
} from "../types";
import { useGenres } from "../context/genres-context";
import { useDeleteTracksStore } from "../store/delete-tracks-store";
import { selectSelectedToDeleteTracks } from "../store/selectors";
import { useTracksQuery } from "../hooks/useTracksQuery";
import { useQueryParamsController } from "../hooks/useQueryParamsController";
import { useModal } from "../hooks/useModal";

import Button from "../ui/Button";

type FiltersProps = {
    setTotalPages: Dispatch<SetStateAction<number>>;
};

export default function Heading({ setTotalPages }: FiltersProps) {
    const { filters, updateQueryParam } = useQueryParamsController();

    const [debounced, setDebounced] = useState({
        search: filters.search,
        artist: filters.artist,
    });

    const [showSuggestions, setShowSuggestions] = useState(false);

    const selectedToDeleteTracks = useDeleteTracksStore(
        selectSelectedToDeleteTracks
    );
    const { genres, isLoadingGenres } = useGenres();
    const { isLoading: isLoadingTracks } = useTracksQuery();
    const {
        openModal: openCreateModal,
        closeModal: closeCreateModal,
        isModalOpened: isCreateModalOpened,
    } = useModal();
    const {
        openModal: openDeleteTracksModal,
        closeModal: closeDeleteTracksModal,
        isModalOpened: isDeleteTracksModalOpened,
    } = useModal();

    // Dynamically import the CreateTrackModal and DeleteTracksModal components
    // to avoid loading them until they're needed
    const [CreateTrackModal, setCreateTrackModal] =
        useState<React.ComponentType<CreateTrackModalProps> | null>(null);
    const [DeleteTracksModal, setDeleteTracksModal] =
        useState<React.ComponentType<DeleteTracksModalProps> | null>(null);

    const handleOpenCreateModal = async () => {
        const module = await import("./CreateTrackModal");
        setCreateTrackModal(() => module.default);
        openCreateModal();
    };
    const handleOpenDeleteTracksModal = async () => {
        const module = await import("./DeleteTracksModal");
        setDeleteTracksModal(() => module.default);
        openDeleteTracksModal();
    };

    useEffect(() => {
        setDebounced({ search: filters.search, artist: filters.artist });
    }, [filters.search, filters.artist]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateQueryParam(QUERY_PARAMS.search, debounced.search.trim());
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [debounced.search, updateQueryParam]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateQueryParam(QUERY_PARAMS.artist, debounced.artist.trim());
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [debounced.artist, updateQueryParam]);

    const matchingGenres =
        filters.genre.length > 0
            ? genres.filter((g) =>
                  g.toLowerCase().startsWith(filters.genre.toLowerCase())
              )
            : [];

    const handleGenreSelect = (genre: string) => {
        updateQueryParam(QUERY_PARAMS.genre, genre);
        setShowSuggestions(false);
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (!isFilterKey(name)) return;

        if (name === QUERY_PARAMS.search || name === QUERY_PARAMS.artist) {
            setDebounced((prev) => ({ ...prev, [name]: value }));
        } else {
            const paramValue =
                name === QUERY_PARAMS.genre ? capitalize(value) : value;
            updateQueryParam(name, paramValue);
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
                        aria-label="Sort by"
                    >
                        {SORT_BY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {FILTER_LABELS[option]}
                            </option>
                        ))}
                    </select>
                    <select
                        name="sortOrder"
                        value={filters.sortOrder}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                        disabled={isLoadingTracks}
                        aria-label="Sort order"
                    >
                        {SORT_ORDER_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {FILTER_LABELS[option]}
                            </option>
                        ))}
                    </select>
                    <Button
                        variant="danger"
                        type="button"
                        onClick={handleOpenDeleteTracksModal}
                        disabled={
                            isLoadingTracks || !selectedToDeleteTracks.length
                        }
                        aria-disabled={isLoadingTracks}
                        data-loading={isLoadingTracks || undefined}
                        data-testid="delete-tracks-button"
                    >
                        Delete tracks
                    </Button>
                    <Button
                        type="button"
                        onClick={handleOpenCreateModal}
                        disabled={isLoadingTracks}
                        aria-disabled={isLoadingTracks}
                        data-loading={isLoadingTracks || undefined}
                        data-testid="create-track-button"
                    >
                        Create Track
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-x-4 gap-y-2">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search..."
                        value={debounced.search}
                        onChange={handleChange}
                        disabled={isLoadingTracks}
                        className="border p-1 rounded w-full"
                        data-testid="search-input"
                        aria-label="Search"
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
                            onBlur={() =>
                                setTimeout(() => setShowSuggestions(false), 150)
                            }
                            className="border p-1 rounded w-full"
                            data-testid="filter-genre"
                            disabled={isLoadingTracks || isLoadingGenres}
                            aria-label="Search genre"
                        />
                        {showSuggestions && matchingGenres.length > 0 && (
                            <ul className="absolute left-0 top-full mt-1 bg-white border rounded w-full shadow z-10">
                                {matchingGenres.map((genre) => (
                                    <li
                                        key={genre}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={() =>
                                            handleGenreSelect(genre)
                                        }
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
                        value={debounced.artist}
                        onChange={handleChange}
                        disabled={isLoadingTracks}
                        className="border p-1 rounded w-full"
                        data-testid="filter-artist"
                        aria-label="Search artist"
                    />
                </div>
            </div>
            {isCreateModalOpened && CreateTrackModal && (
                <CreateTrackModal
                    isModalOpened={isCreateModalOpened}
                    closeModal={closeCreateModal}
                />
            )}
            {isDeleteTracksModalOpened && DeleteTracksModal && (
                <DeleteTracksModal
                    isModalOpened={isDeleteTracksModalOpened}
                    closeModal={closeDeleteTracksModal}
                    setTotalPages={setTotalPages}
                />
            )}
        </>
    );
}
