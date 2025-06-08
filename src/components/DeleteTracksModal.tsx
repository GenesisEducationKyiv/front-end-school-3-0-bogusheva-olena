import { Dispatch, SetStateAction, useState } from "react";

import { deleteTracks } from "../api/tracks";

import { useTrackList } from "../context/track-list-context";
import { useDeleteTracks } from "../context/delete-tracks-context";
import { useToast } from "../hooks/useToast";
import { TRACK_DELETE_MODE, TrackDeleteMode } from "../types";
import { TOAST_MESSAGES } from "../constants";

import { useQueryParamsController } from "../hooks/useQueryParamsController";

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
    const { resetAllQueryParams, updateQueryParam } =
        useQueryParamsController();
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<TrackDeleteMode>(
        TRACK_DELETE_MODE.SELECTED
    );

    const isSelectedMode = mode === TRACK_DELETE_MODE.SELECTED;
    const isAllMode = mode === TRACK_DELETE_MODE.ALL;

    const { updateTrackList, setTracks, allTracksIds, isLoadingAllTracks } =
        useTrackList();
    const { selectedToDeleteTracks, setSelectedToDeleteTracks } =
        useDeleteTracks();
    const { showToast } = useToast();

    const handleDelete = () => {
        setIsLoading(true);
        const tracksToDelete = isSelectedMode
            ? selectedToDeleteTracks
            : allTracksIds;

        deleteTracks(tracksToDelete)
            .then((res) => {
                res.match(
                    (_) => {
                        showToast(
                            TOAST_MESSAGES.MULTIDELETE_SUCCESS,
                            "success"
                        );
                        if (isAllMode) {
                            setTracks([]);
                            resetAllQueryParams();
                            setTotalPages(0);
                        } else {
                            updateTrackList();
                            updateQueryParam("page", "1", { resetPage: false });
                        }
                        setSelectedToDeleteTracks([]);
                        closeModal();
                    },
                    (error) => {
                        showToast(TOAST_MESSAGES.MULTIDELETE_FAIL, "error");
                        console.error("Error deleting tracks:", error);
                        if (isAllMode) updateTrackList();
                    },
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
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
    const isDisabled = isLoading
        ? true
        : isSelectedMode
        ? !allTracksIds.length || isLoadingAllTracks
        : !selectedToDeleteTracks.length;

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
                    {isLoading && <Loader className="mr-2 [&>*]:fill-white" />}
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
