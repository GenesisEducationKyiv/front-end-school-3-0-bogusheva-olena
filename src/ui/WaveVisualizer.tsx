import { useAudioPlayer } from "../context/player-context";
import { Track } from "../types";

interface Props {
    track: Track;
}

export default function WaveVisualizer({ track }: Props) {
    const { isPlaying, currentTrackId, progress } = useAudioPlayer();
    const isCurrent = currentTrackId === track.id;

    return (
        <div className="relative w-full h-3" data-testid={`audio-player-${track.id}`}>
            {isCurrent && isPlaying && (
                <div
                    className="absolute inset-0 h-3 z-10 overflow-hidden"
                    style={{
                        width: `${progress}%`,
                        transition: "width 0.2s linear",
                    }}
                >
                    <div className="flex items-center gap-[3px] h-full w-full">
                        {Array.from({ length: progress }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-green-600 rounded animate-wave"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    height: isPlaying ? "70%" : "40%",
                                    transition: "height 0.2s",
                                    marginInline: "1px",
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded mt-2">
                {track.audioFile && isCurrent && (
                    <div
                        className="h-full bg-green-600 rounded transition-all duration-200"
                        style={{ width: `${progress}%` }}
                        data-testid={`audio-progress-${track.id}`}
                    />
                )}
            </div>
        </div>
    );
}
