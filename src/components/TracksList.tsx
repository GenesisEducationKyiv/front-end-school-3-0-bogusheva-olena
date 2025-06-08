import { Dispatch, SetStateAction, useEffect } from "react";
import { R, pipe } from "@mobily/ts-belt";
import { TOAST_MESSAGES } from "../constants";
import { getTracks } from "../api/tracks";

import { useTrackList } from "../context/track-list-context";
import { useToast } from "../hooks/useToast";
import { useQueryParamsController } from "../hooks/useQueryParamsController";

import TrackItem from "./TrackItem";
import Loader from "../ui/Loader";
import Pagination from "../ui/Pagination";

interface Props {
    totalPages: number;
    setTotalPages: Dispatch<SetStateAction<number>>;
}

export default function TracksList({ totalPages, setTotalPages }: Props) {
    const { filters, updateQueryParam, requestTracksParams } =
        useQueryParamsController();

    const currentPage = Number(filters.page) || 1;

    const {
        tracks,
        setTracks,
        updateCounter,
        isLoadingTracks,
        setIsLoadingTracks,
    } = useTrackList();
    const { showToast } = useToast();

    useEffect(
        () => {
            setIsLoadingTracks(true);

            void getTracks(requestTracksParams).then((res) => {
                pipe(
                    res,
                    R.tap((res) => {
                        setTracks(res.data);
                        setTotalPages(res.meta.totalPages);
                    }),
                    R.tapError((err) => {
                        console.error("Error fetching tracks:", err);
                        showToast(TOAST_MESSAGES.FETCH_FAIL, "error");
                    })
                );
            });

            setIsLoadingTracks(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters, updateCounter]
    );

    const handlePrevPage = () => {
        if (currentPage > 1) updateQueryParam("page", String(currentPage - 1));
    };

    const handleNextPage = () => {
        if (currentPage < totalPages)
            updateQueryParam("page", String(currentPage + 1));
    };

    if (!isLoadingTracks && !tracks.length)
        return <p data-testid="no-tracks">No tracks available</p>;

    return (
        <>
            {isLoadingTracks && (
                <div className="mt-20 max-w-[120px] text-center mx-auto">
                    <Loader
                        className="[&>*]:fill-gray-600 !h-20 !w-20 mx-auto mb-2"
                        testId="loading-tracks"
                    />
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
                    page={currentPage}
                    totalPages={totalPages}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                />
            )}
        </>
    );
}
