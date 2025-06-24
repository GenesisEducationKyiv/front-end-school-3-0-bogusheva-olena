import { useState } from "react";

import { Track } from "../types";

import { useModal } from "../hooks/useModal";
import { useDeleteTracksStore } from "../store/delete-tracks-store";
import {
    selectAddToSelected,
    selectRemoveFromSelected,
    selectSelectedToDeleteTracks,
} from "../store/selectors";
import { useAudioPlayer } from "../context/player-context";

import UploadTrackModal from "./UploadTrackModal";
import DeleteTrackModal from "./DeleteTrackModal";
import EditTrackModal from "./EditTrackModal";
import DropdownMenu from "./DropdownMenu";
import WaveVisualizer from "../ui/WaveVisualizer";
import PlayButton from "../ui/PlayButton";

import defaultCover from "../assets/images/default_cover.webp";
import MenuIcon from "../assets/icons/menu.svg?react";
import CollectionIcon from "../assets/icons/archive.svg?react";

interface Props {
    track: Track;
}

const TrackItem = ({ track }: Props) => {
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

    return (
        <>
            <li
                className="relative border rounded flex-grow"
                data-testid={`track-item-${id}`}
            >
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
                            />
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                className="border rounded p-1 text-sm hover:bg-gray-100"
                                onClick={() => setIsMenuShown((prev) => !prev)}
                                aria-label="Track options"
                                data-testid={`track-item-${id}-options-button`}
                            >
                                <MenuIcon className="w-4 h-4" />
                            </button>
                            {isMenuShown && (
                                <DropdownMenu
                                    track={track}
                                    setShowMenu={setIsMenuShown}
                                    openEditModal={openEditModal}
                                    openDeleteModal={openDeleteModal}
                                    openUploadModal={openUploadModal}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center px-2 pt-2 pb-1 gap-x-2 lg:gap-x-6">
                    <div className="flex flex-shrink-0 justify-between gap-x-2 items-center">
                        <img
                            src={track.coverImage || defaultCover}
                            alt={track.title}
                            className="w-16 h-16 rounded object-cover"
                            data-testid={`track-item-${id}-cover-image`}
                        />
                    </div>
                    <div className="h-[100%] group w-[32px]">
                        {track.audioFile && (
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
                <WaveVisualizer track={track} />
            </li>
            <EditTrackModal
                track={track}
                isModalOpened={isEditModalOpened}
                closeModal={closeEditModal}
            />
            <DeleteTrackModal
                isModalOpened={isDeleteModalOpened}
                closeModal={closeDeleteModal}
                track={track}
            />
            <UploadTrackModal
                isModalOpened={isUploadModalOpened}
                closeModal={closeUploadModal}
                track={track}
            />
        </>
    );
};

export default TrackItem;
