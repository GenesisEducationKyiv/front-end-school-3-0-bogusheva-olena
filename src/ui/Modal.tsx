import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "../assets/icons/close.svg?react";

type Props = {
    isOpened: boolean;
    onClose: () => void;
    title: string;
    name: string;
    children: ReactNode;
};

export default function Modal({
    isOpened,
    onClose,
    title,
    name,
    children,
}: Props) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const modalRoot = document.getElementById("modals");
    if (!modalRoot) return null;

    if (!isOpened) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            data-testid={`${name}-modal`}
            onClick={onClose}
        >
            <div
                className="bg-white rounded shadow-lg p-4 w-full max-w-lg relative"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                data-testid="confirm-dialog"
            >
                <div className="flex justify-between items-center mb-4 border-b pb-2 font-extrabold text-gray-500 ">
                    <div>{title}</div>
                    <button
                        onClick={onClose}
                        className="absolute top-1 right-1 text-xxl"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="w-7 h-7 [&>*]:fill-gray-700" />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        modalRoot,
    );
}
