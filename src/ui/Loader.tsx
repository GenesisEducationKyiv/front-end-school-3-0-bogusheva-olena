import LoaderIcon from "../assets/icons/loader.svg?react";
import { LoaderVariant, Size } from "../types";

type Props = {
    size?: Size;
    variant?: LoaderVariant;
    className?: string;
    testId?: string;
};

export default function Loader({
    size = "small",
    variant = "light",
    className = "",
    testId = "loading-indicator",
}: Props) {
    const sizeClasses = {
        small: "w-6 h-6",
        medium: "w-12 h-12",
        large: "w-20 h-20",
    }[size];

    const variantClasses = {
        light: "[&>*]:fill-white",
        dark: "[&>*]:fill-gray-600",
    }[variant];

    return (
        <div
            className={`flex items-center justify-center animate-spin ${sizeClasses} ${variantClasses} ${className}`}
            data-testid={testId}
        >
            <LoaderIcon />
        </div>
    );
}
