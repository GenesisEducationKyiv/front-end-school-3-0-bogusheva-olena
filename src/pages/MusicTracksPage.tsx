import { useEffect, useState } from "react";
import { FilterOptions } from "../types";
import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS } from "../constants";

import Heading from "../components/Heading";
import TracksList from "../components/TracksList";

export default function MusicTracksPage() {
    const [filters, setFilters] = useState<FilterOptions>({
        sortBy: SORT_BY_OPTIONS[0],
        sortOrder: SORT_ORDER_OPTIONS[0],
        search: "",
        genre: "",
        artist: "",
    });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(
        () => {
            if (page !== 1) {
                setPage(1);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters]
    );

    return (
        <>
            <div className="md:max-w-[60%] mx-auto p-2">
                <h1 data-testid="tracks-header" className="text-2xl font-bold mb-2 text-center">
                    My Music Tracks
                </h1>
                <Heading filters={filters} setFilters={setFilters} setPage={setPage} setTotalPages={setTotalPages} />
                <TracksList
                    filters={filters}
                    page={page}
                    totalPages={totalPages}
                    setTotalPages={setTotalPages}
                    setPage={setPage}
                />
            </div>
        </>
    );
}
