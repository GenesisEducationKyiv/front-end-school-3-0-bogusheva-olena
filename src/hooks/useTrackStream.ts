import { useEffect, useState } from "react";
import { TrackWithoutAudioFile } from "../types";
import { WS_BASE_URL } from "../constants";
import { logError, normalizeError } from "../utils/utils";
import { R } from "@mobily/ts-belt";
import { trackSchemaWithoutAudioFile } from "../schemas/schemas";

export function useTrackStream() {
    const [activeTrack, setActiveTrack] =
        useState<TrackWithoutAudioFile | null>(null);

    useEffect(() => {
        const socket = new WebSocket(WS_BASE_URL);

        socket.onmessage = (event) => {
            const result = (() => {
                try {
                    return R.Ok(JSON.parse(event.data));
                } catch (e) {
                    return R.Error(normalizeError(e));
                }
            })();

            if (R.isError(result)) {
                logError(result._0, "Failed to parse WebSocket data");
                return;
            }

            const parsed = trackSchemaWithoutAudioFile.safeParse(result._0);

            if (parsed.success) {
                setActiveTrack(parsed.data);
            } else {
                logError(parsed.error, "Invalid WebSocket track data");
            }
        };

        socket.onerror = (err) => {
            logError(err, "WebSocket error");
        };

        return () => {
            socket.close();
        };
    }, []);

    return activeTrack;
}
