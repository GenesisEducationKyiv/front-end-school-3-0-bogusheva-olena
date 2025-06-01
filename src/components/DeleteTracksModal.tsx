import { Dispatch, SetStateAction, useState } from "react";

import { deleteTracks } from "../api/tracks";

import { useTrackList } from "../context/track-list-context";
import { useDeleteTracks } from "../context/delete-tracks-context";
import { useToast } from "../hooks/useToast";

import Loader from "../ui/Loader";
import Modal from "../ui/Modal";

interface Props {
    isModalOpened: boolean;
    closeModal: () => void;
    setPage: Dispatch<SetStateAction<number>>;
    setTotalPages: Dispatch<SetStateAction<number>>;
}

export default function DeleteTracksModal({
    isModalOpened,
    closeModal,
    setPage,
    setTotalPages,
}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"selected" | "all">("selected");

    const { updateTrackList, setTracks, allTracksIds, isLoadingAllTracks } =
        useTrackList();
    const { selectedToDeleteTracks, setSelectedToDeleteTracks } =
        useDeleteTracks();
    const { showToast } = useToast();

    const handleDelete = () => {
        setIsLoading(true);
        const tracksToDelete =
            mode === "selected" ? selectedToDeleteTracks : allTracksIds;
        if (mode === "all") {
            setTracks([]);
            setPage(1);
            setTotalPages(0);
        }

        deleteTracks(tracksToDelete)
            .then((res) => {
                res.match(
                    (_) => {
                        showToast("Tracks deleted successfully!", "success");
                        updateTrackList();
                        setSelectedToDeleteTracks([]);
                        closeModal();
                    },
                    (error) => {
                        showToast(
                            "Failed to delete the tracks. Please try again.",
                            "error",
                        );
                        console.error("Error deleting tracks:", error);
                        if (mode === "all") updateTrackList();
                    },
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleClearSelected = () => {
        setSelectedToDeleteTracks([]);
        setMode("selected");
        closeModal();
    };

    const toggleMode = () => setMode(mode === "selected" ? "all" : "selected");
    const isDisabled = isLoading
        ? true
        : mode === "selected"
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
                    mode === "selected" ? "the selected" : "all"
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
                    {mode === "selected"
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
