import { R, pipe } from "@mobily/ts-belt";
import Modal from "../ui/Modal";
import TrackForm from "./TrackForm";
import { useToast } from "../hooks/useToast";
import { FormikHelpers } from "formik";
import { useGenres } from "../context/genres-context";
import { CreateTrackModalProps, TrackFormValues } from "../types";
import { TOAST_MESSAGES } from "../constants";
import { logError } from "../utils/utils";
import { useQueryParamsController } from "../hooks/useQueryParamsController";
import { useCreateTrackMutation } from "../hooks/useCreateTrackMutation";

export default function CreateTrackModal({
    isModalOpened,
    closeModal,
}: CreateTrackModalProps) {
    const { resetAllQueryParams } = useQueryParamsController();
    const { genres } = useGenres();
    const { showToast } = useToast();
    const { mutateAsync, isPending } = useCreateTrackMutation();

    const handleSubmit = async (
        values: TrackFormValues,
        { resetForm }: FormikHelpers<TrackFormValues>
    ) => {
        const res = await mutateAsync({
            title: values.title,
            artist: values.artist,
            album: values.album ?? "",
            genres: values.genres,
            coverImage: values.coverImage ?? "",
        });

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
                logError(err, "Error creating track");
            })
        );
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
                isLoading={isPending}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
}
