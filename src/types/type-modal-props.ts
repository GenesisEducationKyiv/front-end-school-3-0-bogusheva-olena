import { Track } from "./type-main";

export type EditTrackModalProps = {
    track: Track;
    isModalOpened: boolean;
    closeModal: () => void;
};

export type DeleteTrackModalProps = {
    isModalOpened: boolean;
    track: Track;
    closeModal: () => void;
};
export type UploadTrackModalProps = {
    isModalOpened: boolean;
    track: Track;
    closeModal: () => void;
};

export type CreateTrackModalProps = {
    isModalOpened: boolean;
    closeModal: () => void;
};

export type DeleteTracksModalProps = {
    isModalOpened: boolean;
    closeModal: () => void;
    setTotalPages: (totalPages: number) => void;
};
