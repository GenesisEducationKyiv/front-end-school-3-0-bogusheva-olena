import { useState } from "react";

import { Track, TrackFormValues } from "../types";
import { TOAST_MESSAGES } from "../constants";
import { updateTrack } from "../api/tracks";

import { useTrackList } from "../context/track-list-context";
import { useGenres } from "../context/genres-context";
import { useToast } from "../hooks/useToast";
import { useQueryParamsController } from "../hooks/useQueryParamsController";

import Modal from "../ui/Modal";
import TrackForm from "./TrackForm";

interface Props {
    track: Track;
    isModalOpened: boolean;
    closeModal: () => void;
}

export default function EditTrackModal({
    isModalOpened,
    closeModal,
    track,
}: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const { updateTrackInList } = useTrackList();
    const { showToast } = useToast();
    const { genres, isLoadingGenres } = useGenres();
    const { filters, resetAllQueryParams } = useQueryParamsController();

    const handleSubmit = (values: TrackFormValues) => {
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

        updateTrack(
            track.id,
            values.title,
            values.artist,
            values.album ?? "",
            values.genres,
            values.coverImage ?? "",
        )
            .then((res) => {
                res.match(
                    (_) => {
                        showToast(TOAST_MESSAGES.UPDATE_SUCCESS, "success");
                        if (hasChanges && doesNotMatchFilters) {
                            resetAllQueryParams();
                        }
                        closeModal();
                    },
                    (error) => {
                        showToast(TOAST_MESSAGES.UPDATE_FAIL, "error");
                        updateTrackInList(prevTrack);
                        console.error("Error updating track:", error);
                    },
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
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
