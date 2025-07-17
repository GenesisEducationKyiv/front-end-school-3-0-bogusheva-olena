import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { R, pipe } from "@mobily/ts-belt";

import {
    DeleteTracksModalProps,
    TRACK_DELETE_MODE,
    TrackDeleteMode,
} from "../types";
import { QUERY_PARAMS, QUERYKEY, TOAST_MESSAGES } from "../constants";
import { logError } from "../utils/utils";

import { useDeleteTracksStore } from "../store/delete-tracks-store";
import { useTrackStore } from "../store/track-store";
import { useAllTracksQuery } from "../hooks/useAllTracksQuery";
import { useToast } from "../hooks/useToast";
import { useQueryParamsController } from "../hooks/useQueryParamsController";
import { useDeleteTracksMutation } from "../hooks/useDeleteTracksMutation";

import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function DeleteTracksModal({
    isModalOpened,
    closeModal,
    setTotalPages,
}: DeleteTracksModalProps) {
    const queryClient = useQueryClient();
    const { resetAllQueryParams, updateQueryParam } =
        useQueryParamsController();
    const [mode, setMode] = useState<TrackDeleteMode>(
        TRACK_DELETE_MODE.SELECTED
    );

    const isSelectedMode = mode === TRACK_DELETE_MODE.SELECTED;
    const isAllMode = mode === TRACK_DELETE_MODE.ALL;

    const { setTracks, allTracksIds, setAllTracksIds } = useTrackStore();
    const { selectedToDeleteTracks, setSelectedToDeleteTracks } =
        useDeleteTracksStore();

    const { data: res, isLoading: isLoadingAllTracks } = useAllTracksQuery();

    useEffect(
        () => {
            if (res) {
                pipe(
                    res,
                    R.tap((res) => {
                        setAllTracksIds(res.data.map((t) => t.id));
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

    const { showToast } = useToast();
    const { mutateAsync, isPending } = useDeleteTracksMutation();

    const handleDelete = async () => {
        const tracksToDelete = isSelectedMode
            ? selectedToDeleteTracks
            : allTracksIds;

        const res = await mutateAsync({ ids: tracksToDelete });
        pipe(
            res,
            R.tap((_) => {
                showToast(TOAST_MESSAGES.MULTIDELETE_SUCCESS, "success");
                if (isAllMode) {
                    setTracks([]);
                    resetAllQueryParams();
                    setTotalPages(0);
                } else {
                    queryClient.invalidateQueries({
                        queryKey: [QUERYKEY.TRACKS],
                    });
                    updateQueryParam(QUERY_PARAMS.page, "1", {
                        resetPage: false,
                    });
                }
                setSelectedToDeleteTracks([]);
                closeModal();
            }),
            R.tapError((err) => {
                showToast(TOAST_MESSAGES.MULTIDELETE_FAIL, "error");
                logError(err, "Error deleting tracks");
                if (isAllMode)
                    queryClient.invalidateQueries({
                        queryKey: [QUERYKEY.TRACKS],
                    });
            })
        );
    };

    const handleClearSelected = () => {
        setSelectedToDeleteTracks([]);
        setMode(TRACK_DELETE_MODE.SELECTED);
        closeModal();
    };

    const toggleMode = () =>
        setMode(
            isSelectedMode ? TRACK_DELETE_MODE.ALL : TRACK_DELETE_MODE.SELECTED
        );
    const isDeleteButtonDisabled =
        isPending ||
        isLoadingAllTracks ||
        (isSelectedMode
            ? !selectedToDeleteTracks.length
            : !allTracksIds.length);

    const isToggleModeDisabled = isPending || isLoadingAllTracks;

    const isLoading = isPending || isLoadingAllTracks;

    return (
        <Modal
            isOpened={isModalOpened}
            onClose={closeModal}
            title={`Delete ${mode} tracks`}
            name={`delete-${mode}-tracks`}
        >
            <div className="mb-2">
                <p>This action cannot be undone.</p>
                <p>{`Please confirm that you want to delete ${
                    isSelectedMode ? "the selected" : "all"
                } tracks.`}</p>
            </div>
            <div className="mb-2 text-end">
                <Button
                    variant="ghost"
                    size="small"
                    type="button"
                    onClick={toggleMode}
                    disabled={isToggleModeDisabled}
                    aria-disabled={isToggleModeDisabled}
                    data-testid="select-mode-toggle"
                >
                    {isSelectedMode
                        ? "Delete all tracks?"
                        : "Delete selected tracks?"}
                </Button>
            </div>
            <div className="flex gap-x-2">
                <Button
                    type="submit"
                    variant="danger"
                    disabled={isDeleteButtonDisabled}
                    aria-disabled={isDeleteButtonDisabled}
                    data-loading={isLoading || undefined}
                    loading={isPending}
                    data-testid="bulk-delete-button"
                    onClick={handleDelete}
                >
                    {"Yes, delete"}
                </Button>
                <Button
                    type="button"
                    onClick={handleClearSelected}
                    aria-disabled={!selectedToDeleteTracks.length || isLoading}
                    disabled={!selectedToDeleteTracks.length || isLoading}
                >
                    Clear all
                </Button>
                <Button
                    variant="secondary"
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    data-testid="cancel-delete"
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
}
