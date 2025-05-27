import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { Track } from "../types";

import EditIcon from "../assets/icons/edit.svg?react";
import DeleteIcon from "../assets/icons/delete.svg?react";
import UploadIcon from "../assets/icons/upload.svg?react";

interface Props {
    track: Track;
    setShowMenu: Dispatch<SetStateAction<boolean>>;
    openEditModal: () => void;
    openDeleteModal: () => void;
    openUploadModal: () => void;
}

export default function DropdownMenu({ track, setShowMenu, openEditModal, openDeleteModal, openUploadModal }: Props) {
    const id = track.id;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShowMenu]);

    return (
        <div ref={ref} className="absolute right-0 top-0 p-1 space-y-1 border rounded shadow bg-gray-50 z-10 text-sm">
            <button
                type="button"
                onClick={() => {
                    openEditModal();
                    setShowMenu(false);
                }}
                className="border rounded p-1 text-sm w-full h-full hover:bg-gray-200"
                data-testid={`edit-track-${track.id}`}
                aria-label="Edit track"
            >
                <EditIcon className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => {
                    openDeleteModal();
                    setShowMenu(false);
                }}
                className="border rounded p-1 text-sm w-full h-full hover:bg-gray-200"
                data-testid={`delete-track-${id}`}
                aria-label="Delete track"
            >
                <DeleteIcon className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => {
                    openUploadModal();
                    setShowMenu(false);
                }}
                className="border rounded p-1 text-sm w-full h-full hover:bg-gray-200"
                data-testid={`upload-track-${id}`}
                aria-label="Upload track"
            >
                <UploadIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
