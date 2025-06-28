import { useState } from "react";

import Heading from "../components/Heading";
import TracksList from "../components/TracksList";
import { useTrackStream } from "../hooks/useTrackStream";
import TrackItem from "../components/TrackItem";

export default function MusicTracksPage() {
    const [totalPages, setTotalPages] = useState(1);
    const activeTrack = useTrackStream();

    return (
        <>
            <div className="md:max-w-[60%] mx-auto p-2">
                <h1
                    data-testid="tracks-header"
                    className="text-2xl font-bold mb-2 text-center"
                >
                    My Music Tracks
                </h1>
                <div className="pb-4">
                    {activeTrack ? (
                        <>
                            <h3 className="text-center">Our Streaming Track</h3>
                            <TrackItem
                                track={activeTrack}
                                styling="streaming"
                            />
                        </>
                    ) : (
                        <p className="text-gray-500 text-center">
                            Waiting for track...
                        </p>
                    )}
                </div>
                <Heading setTotalPages={setTotalPages} />
                <TracksList
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                />
            </div>
        </>
    );
}
