import { useState } from "react";
import Modal from "../ui/Modal";
import TrackForm, { FormValues } from "./TrackForm";
import { useTrackList } from "../context/track-list-context";
import { useToast } from "../hooks/useToast";
import { createTrack } from "../api/tracks";
import { FormikHelpers } from "formik";
import { useGenres } from "../context/genres-context";

interface Props {
    isModalOpened: boolean;
    closeModal: () => void;
}

export default function CreateTrackModal({ isModalOpened, closeModal }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const { updateTrackList } = useTrackList();
    const { genres } = useGenres();
    const { showToast } = useToast();

    const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        setIsLoading(true);

        createTrack(values.title, values.artist, values.album, values.genres, values.coverImage)
            .then(() => {
                showToast("Track created successfully!", "success");
                updateTrackList();
                resetForm();
                closeModal();
            })
            .catch((error) => {
                showToast("Failed to create track. Please try again.", "error");
                console.error("Error creating track:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    return (
        <Modal isOpened={isModalOpened} onClose={closeModal} title="Create Track" name="create-track">
            <TrackForm genres={genres} closeModal={closeModal} isLoading={isLoading} onSubmit={handleSubmit} />
        </Modal>
    );
}
