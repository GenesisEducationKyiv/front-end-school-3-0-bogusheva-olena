import LoaderIcon from "../assets/icons/loader.svg?react";

type Props = {
    className?: string;
    testId?: string;
};

export default function Loader({ className = "", testId = "loading-indicator" }: Props) {
    return (
        <div className={`flex items-center justify-center animate-spin h-6 w-6  ${className}`} data-testid={testId}>
            <LoaderIcon />
        </div>
    );
}
