import {
    createContext,
    useContext,
    useRef,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { Track } from "../types";
import { PATH } from "../constants";

interface AudioPlayerContextType {
    playTrack: (track: Track) => void;
    pauseTrack: () => void;
    isPlaying: boolean;
    currentTrackId: string | null;
    progress: number;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
    undefined,
);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        const audio = audioRef.current;

        const handleUpdateProgress = () => {
            if (audio.duration) {
                const value = (audio.currentTime / audio.duration) * 100;
                setProgress(value);
            }
        };

        const handleStopPlaying = () => {
            setIsPlaying(false);
            setCurrentTrackId(null);
            setProgress(0);
            audio.currentTime = 0;
        };

        audio.addEventListener("timeupdate", handleUpdateProgress);
        audio.addEventListener("ended", handleStopPlaying);

        return () => {
            audio.removeEventListener("timeupdate", handleUpdateProgress);
            audio.removeEventListener("ended", handleStopPlaying);
        };
    }, []);

    const playTrack = (track: Track) => {
        if (!audioRef.current) return;
        if (!track.audioFile) {
            console.error("No audio file provided for this track");
            return;
        }

        const audio = audioRef.current;

        const isSameTrack = currentTrackId === track.id;

        if (!isSameTrack) {
            audio.src = `${PATH}${track.audioFile}`;
            audio.currentTime = 0;
            setProgress(0);
        }

        audio
            .play()
            .then(() => {
                setCurrentTrackId(track.id);
                setIsPlaying(true);
            })
            .catch((error) => {
                if (error.name === "NotAllowedError") {
                    console.error("Playback was prevented by browser");
                } else {
                    console.error("Error playing audio:", error);
                }
                setIsPlaying(false);
            });
    };

    const pauseTrack = () => {
        if (!audioRef.current) return;

        audioRef.current.pause();
        setIsPlaying(false);
    };

    return (
        <AudioPlayerContext.Provider
            value={{
                playTrack,
                pauseTrack,
                isPlaying,
                currentTrackId,
                progress,
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error(
            "useAudioPlayer must be used within an AudioPlayerProvider",
        );
    }
    return context;
};
