import { useState } from "react";

import { Track } from "../types";
import { updateTrack } from "../api/tracks";

import { useTrackList } from "../context/track-list-context";
import { useGenres } from "../context/genres-context";
import { useToast } from "../hooks/useToast";

import Modal from "../ui/Modal";
import TrackForm from "./TrackForm";

interface Props {
    track: Track;
    isModalOpened: boolean;
    closeModal: () => void;
}
interface FormValues {
    title: string;
    artist: string;
    album: string;
    genres: string[];
    coverImage: string;
}

export default function EditTrackModal({ isModalOpened, closeModal, track }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const { updateTrackInList } = useTrackList();
    const { showToast } = useToast();
    const { genres, isLoadingGenres } = useGenres();

    const handleSubmit = (values: FormValues) => {
        if (!track?.id) return;
        setIsLoading(true);

        const prevTrack = { ...track };
        const updatedTrack = { ...prevTrack, ...values };

        updateTrackInList(updatedTrack);

        updateTrack(track.id, values.title, values.artist, values.album, values.genres, values.coverImage)
            .then(() => {
                showToast("Track updated successfully!", "success");
                closeModal();
            })
            .catch((error) => {
                showToast("Failed to update track. Please try again.", "error");
                updateTrackInList(prevTrack);
                console.error("Error updating track:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Modal isOpened={isModalOpened} onClose={closeModal} title={"Edit Track"} name={`edit-track`}>
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
