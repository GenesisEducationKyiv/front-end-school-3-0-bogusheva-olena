import { useState } from "react";

import Heading from "../components/Heading";
import TracksList from "../components/TracksList";

export default function MusicTracksPage() {
    const [totalPages, setTotalPages] = useState(1);

    return (
        <>
            <div className="md:max-w-[60%] mx-auto p-2">
                <h1
                    data-testid="tracks-header"
                    className="text-2xl font-bold mb-2 text-center"
                >
                    My Music Tracks
                </h1>
                <Heading setTotalPages={setTotalPages} />
                <TracksList
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                />
            </div>
        </>
    );
}
