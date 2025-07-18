import { useState } from "react";
import { R, pipe } from "@mobily/ts-belt";

import { EditTrackModalProps, TrackFormValues } from "../types";
import { TOAST_MESSAGES } from "../constants";
import { updateTrack } from "../api/tracks";
import { logError } from "../utils/utils";
import { useTrackStore } from "../store/track-store";
import { useGenres } from "../context/genres-context";
import { useToast } from "../hooks/useToast";
import { useQueryParamsController } from "../hooks/useQueryParamsController";

import Modal from "../ui/Modal";
import TrackForm from "./TrackForm";

export default function EditTrackModal({
    isModalOpened,
    closeModal,
    track,
}: EditTrackModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const { updateTrackInList } = useTrackStore();
    const { showToast } = useToast();
    const { genres, isLoadingGenres } = useGenres();
    const { filters, resetAllQueryParams } = useQueryParamsController();

    const handleSubmit = async (values: TrackFormValues) => {
        if (!track?.id) return;
        setIsLoading(true);

        const prevTrack = { ...track };
        const updatedTrack = { ...prevTrack, ...values };

        const hasChanges =
            prevTrack.title !== values.title ||
            prevTrack.artist !== values.artist ||
            prevTrack.album !== values.album ||
            prevTrack.coverImage !== values.coverImage ||
            JSON.stringify(prevTrack.genres) !== JSON.stringify(values.genres);

        const doesNotMatchFilters =
            (filters.artist &&
                filters.artist.toLowerCase() !== values.artist.toLowerCase()) ||
            (filters.genre && !values.genres.includes(filters.genre)) ||
            (filters.search &&
                !values.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()));

        updateTrackInList(updatedTrack);

        const res = await updateTrack({
            id: track.id,
            title: values.title,
            artist: values.artist,
            album: values.album ?? "",
            genres: values.genres,
            coverImage: values.coverImage ?? "",
        });
        pipe(
            res,
            R.tap((_) => {
                showToast(TOAST_MESSAGES.UPDATE_SUCCESS, "success");
                if (hasChanges && doesNotMatchFilters) {
                    resetAllQueryParams();
                }
                closeModal();
            }),
            R.tapError((err) => {
                showToast(TOAST_MESSAGES.UPDATE_FAIL, "error");
                updateTrackInList(prevTrack);
                logError(err, "Error updating track");
            })
        );

        setIsLoading(false);
    };

    return (
        <Modal
            isOpened={isModalOpened}
            onClose={closeModal}
            title={"Edit Track"}
            name={`edit-track`}
        >
            <TrackForm
                track={track}
                genres={genres}
                isLoading={isLoading || isLoadingGenres}
                closeModal={closeModal}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}
