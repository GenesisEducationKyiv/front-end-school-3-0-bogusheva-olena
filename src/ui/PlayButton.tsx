import PlayIcon from "../assets/icons/play.svg?react";
import PauseIcon from "../assets/icons/pause.svg?react";

interface Props {
    id: string;
    isPlaying: boolean;
    onClick: () => void;
}

export default function PlayButton({ id, isPlaying, onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            data-testid={isPlaying ? `pause-button-${id}` : `play-button-${id}`}
            aria-label={isPlaying ? "Pause track" : "Play track"}
        >
            {isPlaying ? (
                <PauseIcon
                    className="[&>path]:fill-green-600 group-hover:[&>path]:fill-green-700"
                    aria-label="Pause track"
                />
            ) : (
                <PlayIcon
                    className="[&>g>*]:fill-green-600 group-hover:[&>g>*]:fill-green-700"
                    aria-label="Play track"
                />
            )}
        </button>
    );
}
