import { ChangeEvent, useState } from "react";

import { Track } from "../types";
import { deleteTrackFile, uploadTrackFile } from "../api/tracks";

import { useTrackList } from "../context/track-list-context";
import { useToast } from "../hooks/useToast";

import Loader from "../ui/Loader";
import Modal from "../ui/Modal";
import {
    FILE_ERRORS,
    FILE_MAX_SIZE,
    FILE_PATH,
    TOAST_MESSAGES,
    VALID_FILE_TYPE,
} from "../constants";

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { updateTrackList, updateTrackInList } = useTrackList();
    const { showToast } = useToast();

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

        setIsLoading(true);

        uploadTrackFile(track.id, file)
            .then((res) => {
                res.match(
                    () => {
                        showToast(
                            TOAST_MESSAGES.UPLOAD_FILE_SUCCESS,
                            "success"
                        );
                        updateTrackList();
                        closeModal();
                    },
                    (error) => {
                        showToast(TOAST_MESSAGES.UPLOAD_FILE_FAIL, "error");
                        console.error("Error uploading track:", error);
                    },
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const originalTrack = { ...track };

    const handleDeleteFile = () => {
        setIsLoading(true);

        updateTrackInList({ ...track, audioFile: null });

        deleteTrackFile(track.id)
            .then((res) => {
                res.match(
                    () => {
                        showToast(
                            TOAST_MESSAGES.DELETE_FILE_SUCCESS,
                            "success"
                        );
                        closeModal();
                    },
                    (error) => {
                        showToast(TOAST_MESSAGES.DELETE_FILE_FAIL, "error");
                        updateTrackInList(originalTrack);
                        console.error("Error deleting track file:", error);
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
                        disabled={isLoading}
                    />
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex gap-x-2">
                {track.audioFile ? (
                    <button
                        type="submit"
                        onClick={handleDeleteFile}
                        disabled={isLoading}
                        aria-disabled={isLoading}
                        data-loading={isLoading || undefined}
                        className="flex bg-red-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {isLoading && (
                            <Loader className="mr-2 [&>*]:fill-white" />
                        )}
                        {isLoading ? "Removing..." : "Remove file"}
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={isLoading}
                        aria-disabled={isLoading}
                        data-loading={isLoading || undefined}
                        className="flex bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        data-testid="track-modal-upload-button"
                        onClick={handleUploadFile}
                    >
                        {isLoading && (
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
