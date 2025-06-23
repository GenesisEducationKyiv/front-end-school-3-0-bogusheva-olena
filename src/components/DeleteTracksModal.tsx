import { Dispatch, SetStateAction, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { R, pipe } from "@mobily/ts-belt";

import { TRACK_DELETE_MODE, TrackDeleteMode } from "../types";
import { QUERY_PARAMS, TOAST_MESSAGES } from "../constants";
import { logError } from "../utils/utils";

import { useDeleteTracksStore } from "../store/delete-tracks-store";
import { useTrackStore } from "../store/track-store";
import { useAllTracksQuery } from "../hooks/useAllTracksQuery";
import { useToast } from "../hooks/useToast";
import { useQueryParamsController } from "../hooks/useQueryParamsController";
import { useDeleteTracksMutation } from "../hooks/useDeleteTracksMutation";

import Loader from "../ui/Loader";
import Modal from "../ui/Modal";

interface Props {
    isModalOpened: boolean;
    closeModal: () => void;
    setTotalPages: Dispatch<SetStateAction<number>>;
}

export default function DeleteTracksModal({
    isModalOpened,
    closeModal,
    setTotalPages,
}: Props) {
    const queryClient = useQueryClient();
    const { resetAllQueryParams, updateQueryParam } =
        useQueryParamsController();
    const [mode, setMode] = useState<TrackDeleteMode>(
        TRACK_DELETE_MODE.SELECTED
    );

    const isSelectedMode = mode === TRACK_DELETE_MODE.SELECTED;
    const isAllMode = mode === TRACK_DELETE_MODE.ALL;

    const { setTracks, allTracksIds } = useTrackStore();
    const { isLoading: isLoadingAllTracks } = useAllTracksQuery();
    const { selectedToDeleteTracks, setSelectedToDeleteTracks } =
        useDeleteTracksStore();
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
                    queryClient.invalidateQueries({ queryKey: ["tracks"] });
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
                    queryClient.invalidateQueries({ queryKey: ["tracks"] });
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
    const isDisabled = isPending
        ? true
        : isSelectedMode
        ? !allTracksIds.length || isLoadingAllTracks
        : !selectedToDeleteTracks.length;
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
                <button
                    type="button"
                    onClick={toggleMode}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    data-testid="select-mode-toggle"
                    className="text-sm text-red-500 underline font-extrabold disabled:text-gray-400"
                >
                    {isSelectedMode
                        ? "Delete all tracks?"
                        : "Delete selected tracks?"}
                </button>
            </div>
            <div className="flex gap-x-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    aria-disabled={isLoading}
                    data-loading={isLoading || undefined}
                    className="flex bg-red-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    data-testid="bulk-delete-button"
                    onClick={handleDelete}
                >
                    {isPending && <Loader className="mr-2 [&>*]:fill-white" />}
                    {"Yes, delete"}
                </button>
                <button
                    type="button"
                    onClick={handleClearSelected}
                    aria-disabled={!selectedToDeleteTracks.length || isLoading}
                    disabled={!selectedToDeleteTracks.length || isLoading}
                    className="flex bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Clear all
                </button>
                <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    data-testid="cancel-delete"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}
