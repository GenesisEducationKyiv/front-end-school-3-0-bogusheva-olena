import { useState } from "react";
import { R, pipe } from "@mobily/ts-belt";
import Modal from "../ui/Modal";
import TrackForm from "./TrackForm";
import { useToast } from "../hooks/useToast";
import { createTrack } from "../api/tracks";
import { FormikHelpers } from "formik";
import { useGenres } from "../context/genres-context";
import { TrackFormValues } from "../types";
import { TOAST_MESSAGES } from "../constants";
import { useQueryParamsController } from "../hooks/useQueryParamsController";

interface Props {
    isModalOpened: boolean;
    closeModal: () => void;
}

export default function CreateTrackModal({ isModalOpened, closeModal }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const { resetAllQueryParams } = useQueryParamsController();
    const { genres } = useGenres();
    const { showToast } = useToast();

    const handleSubmit = (
        values: TrackFormValues,
        { resetForm }: FormikHelpers<TrackFormValues>
    ) => {
        setIsLoading(true);

        void createTrack(
            values.title,
            values.artist,
            values.album ?? "",
            values.genres,
            values.coverImage ?? ""
        ).then((res) => {
            pipe(
                res,
                R.tap((_) => {
                    showToast(TOAST_MESSAGES.CREATE_SUCCESS, "success");
                    resetAllQueryParams();
                    resetForm();
                    closeModal();
                }),
                R.tapError((err) => {
                    showToast(TOAST_MESSAGES.CREATE_FAIL, "error");
                    console.error("Error creating track:", err);
                })
            );
        });

        setIsLoading(false);
    };
    return (
        <Modal
            isOpened={isModalOpened}
            onClose={closeModal}
            title="Create Track"
            name="create-track"
        >
            <TrackForm
                genres={genres}
                closeModal={closeModal}
                isLoading={isLoading}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}
