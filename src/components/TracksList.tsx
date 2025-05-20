import { Dispatch, SetStateAction, useEffect } from "react";

import { FilterOptions } from "../types";
import { getTracks } from "../api/tracks";
import { buildQueryParams } from "../utils/utils";

import { useTrackList } from "../context/track-list-context";
import { useToast } from "../hooks/useToast";

import TrackItem from "./TrackItem";
import Loader from "../ui/Loader";
import Pagination from "../ui/Pagination";

interface Props {
    filters: FilterOptions;
    page: number;
    totalPages: number;
    setPage: Dispatch<SetStateAction<number>>;
    setTotalPages: Dispatch<SetStateAction<number>>;
}

export default function TracksList({ filters, page, totalPages, setPage, setTotalPages }: Props) {
    const { tracks, setTracks, updateCounter, isLoadingTracks, setIsLoadingTracks } = useTrackList();
    const { showToast } = useToast();

    useEffect(
        () => {
            setIsLoadingTracks(true);

            const queryParams = buildQueryParams(filters, page);

            getTracks(queryParams)
                .then((res) => {
                    setTracks(res.data);
                    setTotalPages(res.meta.totalPages);
                })
                .catch((error) => {
                    console.error("Error fetching tracks:", error);
                    showToast("Failed to fetch tracks. Please try again.", "error");
                })
                .finally(() => setIsLoadingTracks(false));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters, page, updateCounter]
    );

    const handlePrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    if (!isLoadingTracks && !tracks.length) return <p data-testid="no-tracks">No tracks available</p>;

    return (
        <>
            {isLoadingTracks && (
                <div className="mt-20 max-w-[120px] text-center mx-auto">
                    <Loader className="[&>*]:fill-gray-600 !h-20 !w-20 mx-auto mb-2" testId="loading-tracks" />
                    <p className="text-center">Loading tracks...</p>
                </div>
            )}
            <ul className="space-y-2" data-testid="tracks-list">
                {tracks.map((track) => (
                    <TrackItem key={track.id} track={track} />
                ))}
            </ul>
            {totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                />
            )}
        </>
    );
}
