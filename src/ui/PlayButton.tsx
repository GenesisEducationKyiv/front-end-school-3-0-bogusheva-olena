import PlayIcon from "../assets/icons/play.svg?react";
import PauseIcon from "../assets/icons/pause.svg?react";
import Button from "./Button";

type Props = {
    id: string;
    isPlaying: boolean;
    onClick: () => void;
};

const PLAY_LABEL = "Play track";
const PAUSE_LABEL = "Pause track";

export default function PlayButton({ id, isPlaying, onClick }: Props) {
    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            className="group !p-0"
            data-testid={isPlaying ? `pause-button-${id}` : `play-button-${id}`}
            aria-label={isPlaying ? PAUSE_LABEL : PLAY_LABEL}
        >
            {isPlaying ? (
                <PauseIcon
                    className="[&>path]:fill-green-600 group-hover:[&>path]:fill-green-700 w-8 h-8"
                    aria-label={PAUSE_LABEL}
                />
            ) : (
                <PlayIcon
                    className="[&>g>*]:fill-green-600 group-hover:[&>g>*]:fill-green-700 w-8 h-8"
                    aria-label={PLAY_LABEL}
                />
            )}
        </Button>
    );
}
