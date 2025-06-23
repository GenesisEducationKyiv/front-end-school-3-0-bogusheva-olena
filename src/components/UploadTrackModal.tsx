import { ChangeEvent, useState } from "react";
import { R, pipe } from "@mobily/ts-belt";
import { Track } from "../types";
import {
    FILE_ERRORS,
    FILE_MAX_SIZE,
    FILE_PATH,
    TOAST_MESSAGES,
    VALID_FILE_TYPE,
} from "../constants";
import { logError } from "../utils/utils";

import { useTrackStore } from "../store/track-store";

import { useUploadTrackFileMutation } from "../hooks/useUploadTrackFileMutation";
import { useDeleteTrackFileMutation } from "../hooks/useDeleteTrackFileMutation";
import { useToast } from "../hooks/useToast";

import Loader from "../ui/Loader";
import Modal from "../ui/Modal";

interface Props {
    isModalOpened: boolean;
    track: Track;
    closeModal: () => void;
}

export default function UploadTrackModal({
    isModalOpened,
    closeModal,
    track,
}: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    const { updateTrackInList } = useTrackStore();
    const { showToast } = useToast();

    const {
        mutateAsync: mutateAsyncUploadFile,
        isPending: isPendingUploadFile,
    } = useUploadTrackFileMutation();
    const {
        mutateAsync: mutateAsyncDeleteFile,
        isPending: isPendingDeleteFile,
    } = useDeleteTrackFileMutation();

    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!VALID_FILE_TYPE.includes(selectedFile.type)) {
            setError(FILE_ERRORS.INVALID_TYPE);
        } else if (selectedFile.size > FILE_MAX_SIZE) {
            setError(FILE_ERRORS.TOO_LARGE);
        } else {
            setError("");
            setFile(selectedFile);
        }
    };

    const handleUploadFile = async () => {
        if (!file) return;

        const res = await mutateAsyncUploadFile({ id: track.id, file });

        pipe(
            res,
            R.tap((_) => {
                showToast(TOAST_MESSAGES.UPLOAD_FILE_SUCCESS, "success");
                closeModal();
            }),
            R.tapError((err) => {
                showToast(TOAST_MESSAGES.UPLOAD_FILE_FAIL, "error");
                logError(err, "Error uploading track");
            })
        );
    };

    const handleDeleteFile = async () => {
        const originalTrack = { ...track };
        const { audioFile, ...rest } = track;
        updateTrackInList(rest);

        const res = await mutateAsyncDeleteFile(track.id);

        pipe(
            res,
            R.tap((_) => {
                showToast(TOAST_MESSAGES.DELETE_FILE_SUCCESS, "success");
                closeModal();
            }),
            R.tapError((err) => {
                showToast(TOAST_MESSAGES.DELETE_FILE_FAIL, "error");
                updateTrackInList(originalTrack);
                logError(err, "Error deleting track file");
            })
        );
    };

    const isBusy = isPendingUploadFile || isPendingDeleteFile;

    return (
        <Modal
            isOpened={isModalOpened}
            onClose={closeModal}
            title={track.audioFile ? "Remove file" : "Upload File"}
            name="upload-file"
        >
            <div className="mb-4">
                <p>
                    {track.audioFile
                        ? "Do you want to remove the audio file?"
                        : "Upload the audio file for the track:"}
                </p>
                <p className="font-bold">
                    {track.artist} - {track.title}
                </p>
                {track.audioFile ? (
                    <div>
                        <audio
                            controls
                            src={`${FILE_PATH}${track.audioFile}`}
                            className="w-full mt-2"
                        />
                    </div>
                ) : (
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleChangeFile}
                        className="block mt-4"
                        disabled={isBusy}
                    />
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex gap-x-2">
                {track.audioFile ? (
                    <button
                        type="submit"
                        onClick={handleDeleteFile}
                        disabled={isBusy}
                        aria-disabled={isBusy}
                        data-loading={isBusy || undefined}
                        className="flex bg-red-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {isPendingDeleteFile && (
                            <Loader className="mr-2 [&>*]:fill-white" />
                        )}
                        {isPendingDeleteFile ? "Removing..." : "Remove file"}
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={isBusy}
                        aria-disabled={isBusy}
                        data-loading={isBusy || undefined}
                        className="flex bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        data-testid="track-modal-upload-button"
                        onClick={handleUploadFile}
                    >
                        {isPendingUploadFile && (
                            <Loader className="mr-2 [&>*]:fill-white" />
                        )}
                        Upload
                    </button>
                )}
                <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    data-testid="track-modal-close-button"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}
