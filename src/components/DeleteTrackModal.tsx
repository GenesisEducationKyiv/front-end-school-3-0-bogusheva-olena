import { R, pipe } from "@mobily/ts-belt";
import { DeleteTrackModalProps } from "../types";
import { QUERY_PARAMS, TOAST_MESSAGES } from "../constants";
import { logError } from "../utils/utils";

import { useDeleteTracksStore } from "../store/delete-tracks-store";
import { useTrackStore } from "../store/track-store";
import { useDeleteTrackMutation } from "../hooks/useDeleteTrackMutation";
import { useToast } from "../hooks/useToast";
import { useQueryParamsController } from "../hooks/useQueryParamsController";

import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function DeleteTrackModal({
    isModalOpened,
    closeModal,
    track,
}: DeleteTrackModalProps) {
    const { updateQueryParam } = useQueryParamsController();
    const { removeTrackFromList } = useTrackStore();
    const { removeFromSelected } = useDeleteTracksStore();
    const { showToast } = useToast();
    const { mutateAsync, isPending } = useDeleteTrackMutation();

    const handleDelete = async () => {
        const res = await mutateAsync(track.id);
        pipe(
            res,
            R.tap((_) => {
                removeTrackFromList(track.id);
                showToast(TOAST_MESSAGES.DELETE_SUCCESS, "success");
                removeFromSelected(track.id);
                updateQueryParam(QUERY_PARAMS.page, "1", { resetPage: false });
                closeModal();
            }),
            R.tapError((err) => {
                showToast(TOAST_MESSAGES.DELETE_FAIL, "error");
                logError(err, "Error deleting track");
            })
        );
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
                <Button
                    type="submit"
                    variant="danger"
                    loading={isPending}
                    onClick={handleDelete}
                    disabled={isPending}
                    aria-disabled={isPending}
                    data-loading={isPending || undefined}
                    data-testid="confirm-delete"
                >
                    {"Yes, delete"}
                </Button>
                <Button
                    variant="secondary"
                    type="button"
                    onClick={closeModal}
                    data-testid="cancel-delete"
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
}
