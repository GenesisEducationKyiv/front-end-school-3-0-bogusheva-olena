import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { lazy, Suspense } from "react";
import { Track } from "../types";

import Button from "../ui/Button";

const EditIcon = lazy(() => import("../ui/EditIcon"));
const DeleteIcon = lazy(() => import("../ui/DeleteIcon"));
const UploadIcon = lazy(() => import("../ui/UploadIcon"));

type Props = {
    track: Track;
    setShowMenu: Dispatch<SetStateAction<boolean>>;
    openEditModal: () => void;
    openDeleteModal: () => void;
    openUploadModal: () => void;
};

export default function DropdownMenu({
    track,
    setShowMenu,
    openEditModal,
    openDeleteModal,
    openUploadModal,
}: Props) {
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
        <div
            ref={ref}
            className="absolute right-0 top-0 p-1 space-y-1 border rounded shadow bg-gray-50 z-10 text-sm"
        >
            <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => {
                    openEditModal();
                    setShowMenu(false);
                }}
                className="p-1 w-full h-full"
                data-testid={`edit-track-${track.id}`}
                aria-label="Edit track"
            >
                <Suspense fallback={<span className="inline-block w-4 h-4" />}>
                    <EditIcon className="w-4 h-4" />
                </Suspense>
            </Button>
            <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => {
                    openDeleteModal();
                    setShowMenu(false);
                }}
                className="p-1 w-full h-full"
                data-testid={`delete-track-${id}`}
                aria-label="Delete track"
            >
                <Suspense fallback={<span className="inline-block w-4 h-4" />}>
                    <DeleteIcon className="w-4 h-4" />
                </Suspense>
            </Button>
            <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => {
                    openUploadModal();
                    setShowMenu(false);
                }}
                className="p-1 w-full h-full"
                data-testid={`upload-track-${id}`}
                aria-label="Upload track"
            >
                <Suspense fallback={<span className="inline-block w-4 h-4" />}>
                    <UploadIcon className="w-4 h-4" />
                </Suspense>
            </Button>
        </div>
    );
}
