import { type ButtonHTMLAttributes, type ReactNode } from "react";
import Loader from "./Loader";
import { BtnVariant, Size } from "../types/type-design";

type Props = {
    children?: ReactNode;
    variant?: BtnVariant;
    size?: Size;
    loading?: boolean;
    icon?: ReactNode;
    className?: string;
    testId?: string;
    ariaLabel?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    variant = "primary",
    size = "medium",
    loading = false,
    disabled,
    icon,
    className = "",
    testId,
    ariaLabel,
    type = "button",
    ...rest
}: Props) {
    const isDisabled = disabled || loading;

    const base =
        "inline-flex items-center justify-center rounded font-medium focus:outline-none transition-colors";

    const sizeClasses = {
        small: "text-sm px-2 py-1",
        medium: "text-base px-4 py-2",
        large: "text-lg px-6 py-3",
    }[size];

    const variantClasses = {
        primary:
            "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400",
        secondary:
            "bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300",
        ghost: "bg-transparent text-red-500 underline disabled:text-gray-400 shadow-none hover:text-red-700 !font-bold",
        outline:
            "bg-transparent disabled:text-gray-400 shadow-none rounded hover:bg-gray-200 border border-gray-300 hover:border-gray-400",
    }[variant];

    return (
        <button
            type={type}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            data-loading={loading || undefined}
            className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
            data-testid={testId}
            aria-label={ariaLabel}
            {...rest}
        >
            {loading && (
                <Loader
                    size="small"
                    variant={variant === "secondary" ? "dark" : "light"}
                    className="mr-2"
                />
            )}
            {icon && !loading && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
}

