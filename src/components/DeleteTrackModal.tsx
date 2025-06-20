import { useState } from "react";
import { R, pipe } from "@mobily/ts-belt";
import { deleteTrack } from "../api/tracks";
import { Track } from "../types";
import { QUERY_PARAMS, TOAST_MESSAGES } from "../constants";
import { useTrackList } from "../context/track-list-context";
import { useDeleteTracks } from "../context/delete-tracks-context";
import { useToast } from "../hooks/useToast";
import { useQueryParamsController } from "../hooks/useQueryParamsController";

import Loader from "../ui/Loader";
import Modal from "../ui/Modal";
import { logError } from "../utils/utils";

interface Props {
    isModalOpened: boolean;
    track: Track;
    closeModal: () => void;
}

export default function DeleteTrackModal({
    isModalOpened,
    closeModal,
    track,
}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateQueryParam } = useQueryParamsController();
    const { removeTrackFromList, updateTrackList } = useTrackList();
    const { setSelectedToDeleteTracks } = useDeleteTracks();
    const { showToast } = useToast();

    const handleDelete = async () => {
        setIsLoading(true);

        removeTrackFromList(track.id);

        const res = await deleteTrack(track.id);
        pipe(
            res,
            R.tap((_) => {
                showToast(TOAST_MESSAGES.DELETE_SUCCESS, "success");
                setSelectedToDeleteTracks((prev) =>
                    prev.filter((id) => id !== track.id)
                );
                updateQueryParam(QUERY_PARAMS.page, "1", { resetPage: false });
                closeModal();
            }),
            R.tapError((err) => {
                showToast(TOAST_MESSAGES.DELETE_FAIL, "error");
                logError(err, "Error deleting track");
            })
        );

        updateTrackList();
        setIsLoading(false);
    };

    return (
        <Modal
            isOpened={isModalOpened}
            onClose={closeModal}
            title={"Delete Track"}
            name="delete-track"
        >
            <div className="mb-4">
                <p>Do you want to delete the track:</p>
                <p className="font-bold">
                    {track.artist} - {track.title}
                </p>
            </div>
            <div className="flex gap-x-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    aria-disabled={isLoading}
                    data-loading={isLoading || undefined}
                    className="flex bg-red-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    data-testid="confirm-delete"
                    onClick={handleDelete}
                >
                    {isLoading && <Loader className="mr-2 [&>*]:fill-white" />}
                    {"Yes, delete"}
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
