import { Dispatch, SetStateAction, useEffect } from "react";
import { R, pipe } from "@mobily/ts-belt";
import { QUERY_PARAMS, TOAST_MESSAGES } from "../constants";
import { logError } from "../utils/utils";
import { useTrackStore } from "../store/track-store";
import { useToast } from "../hooks/useToast";
import { useQueryParamsController } from "../hooks/useQueryParamsController";
import { useTracksQuery } from "../hooks/useTracksQuery";
import TrackItem from "./TrackItem";
import Loader from "../ui/Loader";
import Pagination from "../ui/Pagination";

type Props = {
    totalPages: number;
    setTotalPages: Dispatch<SetStateAction<number>>;
};

export default function TracksList({ totalPages, setTotalPages }: Props) {
    const { filters, updateQueryParam, requestTracksParams } =
        useQueryParamsController();

    const currentPage = Number(filters.page) || 1;

    const { tracks, setTracks } = useTrackStore();
    const { showToast } = useToast();

    const { data: res, isLoading: isLoadingTracks } =
        useTracksQuery(requestTracksParams);

    useEffect(
        () => {
            if (res) {
                pipe(
                    res,
                    R.tap((res) => {
                        setTracks(res.data);
                        setTotalPages(res.meta.totalPages);
                    }),
                    R.tapError((err) => {
                        logError(err, "Error fetching tracks");
                        showToast(TOAST_MESSAGES.FETCH_FAIL, "error");
                    })
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [res]
    );

    const handlePrevPage = () => {
        if (currentPage > 1)
            updateQueryParam(QUERY_PARAMS.page, String(currentPage - 1));
    };

    const handleNextPage = () => {
        if (currentPage < totalPages)
            updateQueryParam(QUERY_PARAMS.page, String(currentPage + 1));
    };

    if (!isLoadingTracks && !tracks.length)
        return <p data-testid="no-tracks">No tracks available</p>;

    return (
        <>
            {isLoadingTracks && (
                <div className="mt-20 max-w-[120px] text-center mx-auto">
                    <Loader
                        variant="dark"
                        size="large"
                        className="mx-auto mb-2"
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
