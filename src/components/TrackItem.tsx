import React, { Suspense, useState } from "react";

import {
    DeleteTrackModalProps,
    EditTrackModalProps,
    Track,
    UploadTrackModalProps,
} from "../types";

import { useModal } from "../hooks/useModal";
import { useDeleteTracksStore } from "../store/delete-tracks-store";
import {
    selectAddToSelected,
    selectRemoveFromSelected,
    selectSelectedToDeleteTracks,
} from "../store/selectors";
import { useAudioPlayer } from "../context/player-context";

import DropdownMenu from "./DropdownMenu";
import PlayButton from "../ui/PlayButton";

import defaultCover from "../assets/images/default_cover.webp";
import MenuIcon from "../assets/icons/menu.svg?react";
import CollectionIcon from "../assets/icons/archive.svg?react";

const WaveVisualizer = React.lazy(() => import("../ui/WaveVisualizer"));

type Props = {
    track: Track;
    styling?: "default" | "streaming";
};

const TrackItem = ({ track, styling = "default" }: Props) => {
    const id = track.id;

    const {
        openModal: openEditModal,
        closeModal: closeEditModal,
        isModalOpened: isEditModalOpened,
    } = useModal();
    const {
        openModal: openDeleteModal,
        closeModal: closeDeleteModal,
        isModalOpened: isDeleteModalOpened,
    } = useModal();
    const {
        openModal: openUploadModal,
        closeModal: closeUploadModal,
        isModalOpened: isUploadModalOpened,
    } = useModal();

    // Dynamically import the EditTrackModal component
    // to avoid loading it until it's needed
    const [EditTrackModal, setEditTrackModal] =
        useState<React.ComponentType<EditTrackModalProps> | null>(null);
    const [DeleteTrackModal, setDeleteTrackModal] =
        useState<React.ComponentType<DeleteTrackModalProps> | null>(null);
    const [UploadTrackModal, setUploadTrackModal] =
        useState<React.ComponentType<UploadTrackModalProps> | null>(null);

    const handleOpenEditModal = async () => {
        const module = await import("./EditTrackModal");
        setEditTrackModal(() => module.default);
        openEditModal();
    };
    const handleOpenDeleteModal = async () => {
        const module = await import("./DeleteTrackModal");
        setDeleteTrackModal(() => module.default);
        openDeleteModal();
    };
    const handleOpenUploadModal = async () => {
        const module = await import("./UploadTrackModal");
        setUploadTrackModal(() => module.default);
        openUploadModal();
    };

    const selectedToDeleteTracks = useDeleteTracksStore(
        selectSelectedToDeleteTracks
    );
    const addToSelected = useDeleteTracksStore(selectAddToSelected);
    const removeFromSelected = useDeleteTracksStore(selectRemoveFromSelected);

    const { playTrack, pauseTrack, isPlaying, currentTrackId } =
        useAudioPlayer();

    const [isMenuShown, setIsMenuShown] = useState(false);

    const checked = selectedToDeleteTracks.includes(id);
    const isCurrent = currentTrackId === id;

    const handleTogglePlay = () => {
        if (isCurrent && isPlaying) {
            pauseTrack();
        } else {
            playTrack(track);
        }
    };

    const toggleChecked = () => {
        if (checked) {
            removeFromSelected(id);
        } else {
            addToSelected(id);
        }
    };

    const isStreamingTrack = styling === "streaming";

    return (
        <>
            <li
                className={`relative border rounded flex-grow list-none ${
                    isStreamingTrack
                        ? "border-green-600 pb-1 lg:max-w-[70%] mx-auto"
                        : ""
                }`}
                data-testid={
                    isStreamingTrack ? "streaming-track" : `track-item-${id}`
                }
            >
                {!isStreamingTrack && (
                    <div className="flex items-center justify-end">
                        {track.album && (
                            <div
                                data-testid={`track-item-${id}-album`}
                                className="border md:absolute bottom-2 right-0 m-2 p-1 border-gray-200 rounded text-sm text-gray-500"
                            >
                                {track.album}
                            </div>
                        )}

                        <div className="md:absolute top-0 right-0 m-2 flex gap-x-1.5 justify-end flex-grow">
                            <div className="relative" onClick={toggleChecked}>
                                <CollectionIcon
                                    className={`w-[26px] h-[26px] cursor-pointer ${
                                        checked
                                            ? "[&>*]:fill-red-600"
                                            : "[&>*]:fill-green-600"
                                    }`}
                                />
                                <input
                                    type="checkbox"
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={toggleChecked}
                                    checked={checked}
                                    data-testid={`track-checkbox-${id}`}
                                    aria-label={`Select track ${track.title}`}
                                />
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="border rounded p-1 text-sm hover:bg-gray-100"
                                    onClick={() =>
                                        setIsMenuShown((prev) => !prev)
                                    }
                                    aria-label="Track options"
                                    data-testid={`track-item-${id}-options-button`}
                                >
                                    <MenuIcon className="w-4 h-4" />
                                </button>
                                {isMenuShown && (
                                    <DropdownMenu
                                        track={track}
                                        setShowMenu={setIsMenuShown}
                                        openEditModal={handleOpenEditModal}
                                        openDeleteModal={handleOpenDeleteModal}
                                        openUploadModal={handleOpenUploadModal}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex items-center px-2 pt-2 pb-1 gap-x-2 lg:gap-x-6">
                    <div className="flex flex-shrink-0 justify-between gap-x-2 items-center">
                        <img
                            src={
                                isStreamingTrack
                                    ? defaultCover
                                    : track.coverImage || defaultCover
                            }
                            alt={track.title}
                            loading="lazy"
                            className="w-16 h-16 rounded object-cover"
                            data-testid={`track-item-${id}-cover-image`}
                        />
                    </div>
                    <div className="h-[100%] group w-[32px]">
                        {track.audioFile && !isStreamingTrack && (
                            <PlayButton
                                id={id}
                                isPlaying={isCurrent && isPlaying}
                                onClick={handleTogglePlay}
                                data-testid={`track-item-${id}-play-button`}
                            />
                        )}
                    </div>
                    <div className="flex-grow text-left">
                        <p
                            data-testid={`track-item-${id}-title`}
                            className="font-bold text-lg"
                        >
                            {track.title}
                        </p>
                        <p
                            data-testid={`track-item-${id}-artist`}
                            className="text-sm text-gray-500"
                        >
                            {track.artist}
                        </p>
                    </div>
                </div>
                <Suspense fallback={null}>
                    {!isStreamingTrack && <WaveVisualizer track={track} />}
                </Suspense>
            </li>
            {isEditModalOpened && EditTrackModal && (
                <EditTrackModal
                    track={track}
                    isModalOpened={isEditModalOpened}
                    closeModal={closeEditModal}
                />
            )}
            {isDeleteModalOpened && DeleteTrackModal && (
                <DeleteTrackModal
                    isModalOpened={isDeleteModalOpened}
                    closeModal={closeDeleteModal}
                    track={track}
                />
            )}
            {isUploadModalOpened && UploadTrackModal && (
                <UploadTrackModal
                    isModalOpened={isUploadModalOpened}
                    closeModal={closeUploadModal}
                    track={track}
                />
            )}
        </>
    );
};

export default TrackItem;
