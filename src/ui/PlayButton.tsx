import PlayIcon from "../assets/icons/play.svg?react";
import PauseIcon from "../assets/icons/pause.svg?react";

interface Props {
    id: string;
    isPlaying: boolean;
    onClick: () => void;
}

const PLAY_LABEL = "Play track";
const PAUSE_LABEL = "Pause track";

export default function PlayButton({ id, isPlaying, onClick }: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            data-testid={isPlaying ? `pause-button-${id}` : `play-button-${id}`}
            aria-label={isPlaying ? PAUSE_LABEL : PLAY_LABEL}
        >
            {isPlaying ? (
                <PauseIcon
                    className="[&>path]:fill-green-600 group-hover:[&>path]:fill-green-700"
                    aria-label={PAUSE_LABEL}
                />
            ) : (
                <PlayIcon
                    className="[&>g>*]:fill-green-600 group-hover:[&>g>*]:fill-green-700"
                    aria-label={PLAY_LABEL}
                />
            )}
        </button>
    );
}
