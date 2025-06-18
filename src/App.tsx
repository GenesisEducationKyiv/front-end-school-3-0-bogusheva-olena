import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { TrackListProvider } from "./context/track-list-context";
import { AudioPlayerProvider } from "./context/player-context";
import { DeleteTracksProvider } from "./context/delete-tracks-context";
import { GenresProvider } from "./context/genres-context";
import { ROUTES } from "./constants";

import MusicTracksPage from "./pages/MusicTracksPage";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <AudioPlayerProvider>
                <GenresProvider>
                    <TrackListProvider>
                        <DeleteTracksProvider>
                            <main>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <Navigate to={ROUTES.TRACKS} />
                                        }
                                    />
                                    <Route
                                        path={ROUTES.TRACKS}
                                        element={<MusicTracksPage />}
                                    />
                                </Routes>
                            </main>
                        </DeleteTracksProvider>
                    </TrackListProvider>
                </GenresProvider>
            </AudioPlayerProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
                data-testid="toast-container"
            />
        </BrowserRouter>
    );
}

export default App;
